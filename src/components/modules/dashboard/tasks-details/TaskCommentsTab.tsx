"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageSquare } from "lucide-react";
import { createComment, deleteComment, updateComment } from "@/actions/comment.action";

const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(5000, "Comment too long"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface TaskCommentsTabProps {
    comments: any;
    taskId: string;
    userRole: string;
    currentUserId: string;
}

const getRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return then.toLocaleDateString();
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function TaskCommentsTab({ comments, taskId, userRole, currentUserId }: TaskCommentsTabProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormValues>({
        resolver: zodResolver(commentSchema),
        defaultValues: { content: "" },
    });

    const commentList = comments?.comments || [];

    const onSubmit = async (data: CommentFormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Adding comment...");
        const result = await createComment(taskId, { content: data.content });
        if (result.success) {
            toast.success("Comment added", { id: toastId });
            reset();
        } else {
            toast.error(result.message || "Failed to add comment", { id: toastId });
        }
        setIsSubmitting(false);
    };

    const handleEditComment = async (commentId: string) => {
        const toastId = toast.loading("Updating comment...");
        const result = await updateComment(commentId, editContent, taskId);
        if (result.success) {
            toast.success("Comment updated", { id: toastId });
            setEditingCommentId(null);
            setEditContent("");
        } else {
            toast.error(result.message || "Failed to update comment", { id: toastId });
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        const toastId = toast.loading("Deleting comment...");
        const result = await deleteComment(commentId, taskId);
        if (result.success) {
            toast.success("Comment deleted", { id: toastId });
        } else {
            toast.error(result.message || "Failed to delete comment", { id: toastId });
        }
    };

    const canModify = (commentUserId: string) => {
        return commentUserId === currentUserId || userRole === "ADMIN";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Add Comment Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <Textarea
                        placeholder="Add a comment..."
                        {...register("content")}
                        className={errors.content ? "border-red-500" : ""}
                        rows={3}
                    />
                    {errors.content && (
                        <p className="text-sm text-red-500">{errors.content.message}</p>
                    )}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post Comment"
                            )}
                        </Button>
                    </div>
                </form>

                {/* Comments List */}
                {commentList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {commentList.map((comment: any) => (
                            <div key={comment.id} className="border rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={comment.user?.image || undefined} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                            {getInitials(comment.user?.name || "U")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-sm">{comment.user?.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {getRelativeTime(comment.createdAt)}
                                            </span>
                                            {comment.isEdited && (
                                                <span className="text-xs text-muted-foreground">(edited)</span>
                                            )}
                                        </div>
                                        
                                        {editingCommentId === comment.id ? (
                                            <div className="mt-2 space-y-2">
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                                                        Save
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => setEditingCommentId(null)}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
                                        )}

                                        {!editingCommentId && canModify(comment.userId) && (
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingCommentId(comment.id);
                                                        setEditContent(comment.content);
                                                    }}
                                                    className="text-xs text-muted-foreground hover:text-indigo-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-xs text-red-500 hover:text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}