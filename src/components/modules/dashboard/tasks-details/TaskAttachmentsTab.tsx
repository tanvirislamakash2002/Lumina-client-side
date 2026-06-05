"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, Download, Trash2, Upload, File, Image, FileText, Archive } from "lucide-react";
import { toast } from "sonner";
import { uploadTaskAttachment, deleteTaskAttachment } from "@/actions/upload.action";

interface TaskAttachmentsTabProps {
    attachments: any;
    taskId: string;
    userRole: string;
    currentUserId: string;
}

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return Image;
    if (mimeType === "application/pdf") return FileText;
    if (mimeType.includes("zip") || mimeType.includes("archive")) return Archive;
    return File;
};

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function TaskAttachmentsTab({ attachments, taskId, userRole, currentUserId }: TaskAttachmentsTabProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const attachmentList = attachments?.attachments || [];

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading file...");
        
        const formData = new FormData();
        formData.append("file", file);
        
        const result = await uploadTaskAttachment(taskId, formData);
        if (result.success) {
            toast.success("File uploaded", { id: toastId });
        } else {
            toast.error(result.message || "Failed to upload file", { id: toastId });
        }
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDeleteAttachment = async (attachmentId: string, filename: string) => {
        const toastId = toast.loading(`Deleting "${filename}"...`);
        const result = await deleteTaskAttachment(attachmentId, taskId);
        if (result.success) {
            toast.success(`"${filename}" deleted`, { id: toastId });
        } else {
            toast.error(result.message || "Failed to delete file", { id: toastId });
        }
    };

    const canUpload = userRole === "ADMIN" || userRole === "PROJECT_MANAGER" || true; // Team members can also upload
    const canDelete = (uploaderId: string) => {
        return uploaderId === currentUserId || userRole === "ADMIN" || userRole === "PROJECT_MANAGER";
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Attachments</CardTitle>
                {canUpload && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            {isUploading ? "Uploading..." : "Upload File"}
                        </Button>
                    </>
                )}
            </CardHeader>
            <CardContent>
                {attachmentList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Paperclip className="h-12 w-12 mb-3 opacity-50" />
                        <p>No attachments yet. Upload files to share with your team.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {attachmentList.map((attachment: any) => {
                            const Icon = getFileIcon(attachment.mimeType);
                            return (
                                <div key={attachment.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2 rounded-lg bg-muted">
                                            <Icon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{attachment.originalName}</p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>{formatFileSize(attachment.size)}</span>
                                                <div className="flex items-center gap-1">
                                                    <Avatar className="h-4 w-4">
                                                        <AvatarImage src={attachment.uploader?.image || undefined} />
                                                        <AvatarFallback className="text-[8px]">
                                                            {getInitials(attachment.uploader?.name || "U")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>{attachment.uploader?.name}</span>
                                                </div>
                                                <span>{getRelativeTime(attachment.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                            <a href={attachment.url} target="_blank" rel="noopener noreferrer" download>
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        {canDelete(attachment.uploadedBy) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                                onClick={() => handleDeleteAttachment(attachment.id, attachment.originalName)}
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