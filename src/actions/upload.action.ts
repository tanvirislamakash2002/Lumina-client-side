"use server";

import { uploadService } from "@/services/upload.service";
import { updateTag } from "next/cache";

// Upload avatar
export const uploadAvatar = async (formData: FormData) => {
    const result = await uploadService.uploadAvatar(formData);
    if (result.success) {
        updateTag("user-profile");
        updateTag("current-user");
    }
    return result;
};

// Remove avatar
export const removeAvatar = async () => {
    const result = await uploadService.removeAvatar();
    if (result.success) {
        updateTag("user-profile");
        updateTag("current-user");
    }
    return result;
};

// Upload task attachment
export const uploadTaskAttachment = async (taskId: string, formData: FormData) => {
    const result = await uploadService.uploadTaskAttachment(taskId, formData);
    if (result.success) {
        updateTag(`task-attachments-${taskId}`);
        updateTag(`task-${taskId}`);
    }
    return result;
};

// Delete task attachment
export const deleteTaskAttachment = async (attachmentId: string, taskId: string) => {
    const result = await uploadService.deleteTaskAttachment(attachmentId);
    if (result.success) {
        updateTag(`task-attachments-${taskId}`);
        updateTag(`task-${taskId}`);
    }
    return result;
};

// Get task attachments
export const getTaskAttachments = async (taskId: string) => {
    return await uploadService.getTaskAttachments(taskId);
};

// Upload project image
export const uploadProjectImage = async (projectId: string, formData: FormData) => {
    const result = await uploadService.uploadProjectImage(projectId, formData);
    if (result.success) {
        updateTag(`project-${projectId}`);
        updateTag("user-projects");
    }
    return result;
};