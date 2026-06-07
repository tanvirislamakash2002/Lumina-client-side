"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createComment } from "@/actions/comment.action";

interface MemberTaskCommentsProps {
    taskId: string;
    initialComments: any[];
    currentUserId: string;
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

export function MemberTaskComments({
    taskId,
    initialComments,
    currentUserId,
    onCommentUpdate,
}: MemberTaskCommentsProps) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (comments.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Comments
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <div className="text-center py-8 text-muted-foreground">
                        No comments yet. Be the first to comment!
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
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
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.user?.image || undefined} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                    {getInitials(comment.user?.name || "U")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                        {comment.user?.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {getRelativeTime(comment.createdAt)}
                                    </span>
                                    {comment.isEdited && (
                                        <span className="text-xs text-muted-foreground">
                                            (edited)
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm mt-1 whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}