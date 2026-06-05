export interface UploadedFile {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    createdAt: string;
}

export interface Attachment extends UploadedFile {
    taskId: string;
    uploadedBy: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}

export interface AvatarUploadResponse {
    success: boolean;
    data?: {
        url: string;
        user: {
            id: string;
            name: string;
            email: string;
            image: string | null;
            role: string;
        };
    };
    message?: string;
}

export interface AttachmentUploadResponse {
    success: boolean;
    data?: Attachment;
    message?: string;
}

export interface AttachmentsResponse {
    success: boolean;
    data?: {
        attachments: Attachment[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
        stats: {
            total: number;
            totalSize: number;
        };
    };
    message?: string;
}

export interface DeleteAttachmentResponse {
    success: boolean;
    message: string;
}

export interface ProjectImageUploadResponse {
    success: boolean;
    data?: {
        projectId: string;
        url: string;
    };
    message?: string;
}

// File validation types
export interface FileValidation {
    isValid: boolean;
    error?: string;
}

export type AllowedMimeType = 
    | "image/jpeg"
    | "image/jpg"
    | "image/png"
    | "image/gif"
    | "image/webp"
    | "application/pdf"
    | "application/msword"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "text/plain"
    | "application/zip"
    | "application/x-zip-compressed";

export const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/zip",
    "application/x-zip-compressed",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB