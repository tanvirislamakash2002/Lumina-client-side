"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { MessageSquare, Trash2, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createComment, updateComment, deleteComment } from "@/actions/comment.action";

interface TaskCommentsProps {
    taskId: string;
    initialComments: any[];
    currentUserId: string;
    userRole: string;
    onCommentUpdate: () => void;
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

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
    return format(then, "MMM dd, yyyy");
};

export function TaskComments({
    taskId,
    initialComments,
    currentUserId,
    userRole,
    onCommentUpdate,
}: TaskCommentsProps) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    
    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<any>(null);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createComment(taskId, { content: newComment.trim() });
            if (result.success) {
                toast.success("Comment added");
                setNewComment("");
                onCommentUpdate();
            } else {
                toast.error(result.message || "Failed to add comment");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateComment = async (commentId: string) => {
        if (!editContent.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateComment(commentId, editContent.trim(), taskId);
            if (result.success) {
                toast.success("Comment updated");
                setEditingCommentId(null);
                setEditContent("");
                onCommentUpdate();
            } else {
                toast.error(result.message || "Failed to update comment");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async () => {
        if (!commentToDelete) return;

        setIsSubmitting(true);
        try {
            const result = await deleteComment(commentToDelete.id, taskId);
            if (result.success) {
                toast.success("Comment deleted");
                setDeleteDialogOpen(false);
                setCommentToDelete(null);
                onCommentUpdate();
            } else {
                toast.error(result.message || "Failed to delete comment");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteDialog = (comment: any) => {
        setCommentToDelete(comment);
        setDeleteDialogOpen(true);
    };

    const canEditComment = (comment: any) => {
        return comment.userId === currentUserId || userRole === "ADMIN";
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Comments
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add Comment */}
                    <div className="space-y-3">
                        <Textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={handleAddComment}
                                disabled={isSubmitting || !newComment.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Post Comment
                            </Button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No comments yet. Be the first to comment!
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={comment.user?.image || undefined} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                            {getInitials(comment.user?.name || "U")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium">
                                                    {comment.user?.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-2">
                                                    {getRelativeTime(comment.createdAt)}
                                                </span>
                                                {comment.isEdited && (
                                                    <span className="text-xs text-muted-foreground ml-2">
                                                        (edited)
                                                    </span>
                                                )}
                                            </div>
                                            {canEditComment(comment) && (
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => {
                                                            setEditingCommentId(comment.id);
                                                            setEditContent(comment.content);
                                                        }}
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-red-500 hover:text-red-700"
                                                        onClick={() => openDeleteDialog(comment)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        {editingCommentId === comment.id ? (
                                            <div className="mt-2 space-y-2">
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    rows={2}
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingCommentId(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleUpdateComment(comment.id)}
                                                        disabled={isSubmitting}
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm mt-1 whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Comment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {commentToDelete && (
                        <div className="py-2">
                            <p className="text-sm text-muted-foreground italic">
                                "{commentToDelete.content.length > 100 
                                    ? commentToDelete.content.substring(0, 100) + "..." 
                                    : commentToDelete.content}"
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteComment}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Comment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}