"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface AdminTaskCommentsProps {
    comments: any[];
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

export function AdminTaskComments({ comments }: AdminTaskCommentsProps) {
    if (comments.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Comments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No comments on this task.
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
                    Comments ({comments.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
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
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Link
                                        href={`/dashboard/users/${comment.user?.id}`}
                                        className="text-sm font-medium hover:text-indigo-600 transition-colors"
                                    >
                                        {comment.user?.name}
                                    </Link>
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