"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Paperclip, Download, Trash2, Upload, FileText, Image, File, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadTaskAttachment, deleteTaskAttachment } from "@/actions/upload.action";

interface TaskAttachmentsProps {
    taskId: string;
    initialAttachments: any[];
    canEdit: boolean;
    currentUserId: string;
    userRole: string;
    onAttachmentUpdate: () => void;
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

export function TaskAttachments({
    taskId,
    initialAttachments,
    canEdit,
    currentUserId,
    userRole,
    onAttachmentUpdate,
}: TaskAttachmentsProps) {
    const [attachments, setAttachments] = useState(initialAttachments);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("File type not allowed. Allowed: images, PDF, DOC, DOCX, TXT");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadTaskAttachment(taskId, formData);
            if (result.success) {
                toast.success("File uploaded successfully");
                onAttachmentUpdate();
            } else {
                toast.error(result.message || "Failed to upload file");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async (attachmentId: string, filename: string) => {
        if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

        try {
            const result = await deleteTaskAttachment(attachmentId, taskId);
            if (result.success) {
                toast.success("File deleted successfully");
                onAttachmentUpdate();
            } else {
                toast.error(result.message || "Failed to delete file");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const canDeleteAttachment = (attachment: any) => {
        return attachment.uploadedBy === currentUserId || userRole === "ADMIN" || userRole === "PROJECT_MANAGER";
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Attachments
                </CardTitle>
                {canEdit && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleUpload}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="gap-2"
                        >
                            {isUploading ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                            Upload File
                        </Button>
                    </>
                )}
            </CardHeader>
            <CardContent>
                {attachments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No attachments yet. Upload files to share with the team.
                    </div>
                ) : (
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
                                            <div className="flex items-center gap-2 mt-1">
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
                                                    <span className="text-xs text-muted-foreground">
                                                        {attachment.uploader?.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">•</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {getRelativeTime(attachment.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
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
                                        {canDeleteAttachment(attachment) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(attachment.id, attachment.filename)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function Loader2Icon(props: any) {
    return <Loader2 {...props} />;
}