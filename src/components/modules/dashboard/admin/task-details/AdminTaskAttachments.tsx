"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Paperclip, Download, FileText, Image, File } from "lucide-react";
import Link from "next/link";

interface AdminTaskAttachmentsProps {
    attachments: any[];
}

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return Image;
    if (mimeType === "application/pdf") return FileText;
    return File;
};

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

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

export function AdminTaskAttachments({ attachments }: AdminTaskAttachmentsProps) {
    if (attachments.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Paperclip className="h-5 w-5" />
                        Attachments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No attachments on this task.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Attachments ({attachments.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {attachments.map((attachment) => {
                        const FileIcon = getFileIcon(attachment.mimeType);
                        return (
                            <div
                                key={attachment.id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {attachment.filename}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className="text-xs text-muted-foreground">
                                                {formatFileSize(attachment.size)}
                                            </span>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <div className="flex items-center gap-1">
                                                <Avatar className="h-4 w-4">
                                                    <AvatarImage src={attachment.uploader?.image || undefined} />
                                                    <AvatarFallback className="text-[8px]">
                                                        {getInitials(attachment.uploader?.name || "U")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <Link
                                                    href={`/dashboard/users/${attachment.uploader?.id}`}
                                                    className="text-xs text-muted-foreground hover:text-indigo-600 transition-colors"
                                                >
                                                    {attachment.uploader?.name}
                                                </Link>
                                            </div>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <span className="text-xs text-muted-foreground">
                                                {getRelativeTime(attachment.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    asChild
                                >
                                    <a href={attachment.url} download target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}