"use server";

import { commentService } from "@/services/comment.service";
import { updateTag } from "next/cache";

// Create a comment or reply
export const createComment = async (
    taskId: string,
    data: { content: string; parentId?: string | null }
) => {
    // Validate content
    if (!data.content || data.content.trim().length === 0) {
        return {
            success: false,
            message: "Comment content cannot be empty",
        };
    }

    // Validate content length
    if (data.content.length > 5000) {
        return {
            success: false,
            message: "Comment cannot exceed 5000 characters",
        };
    }

    const result = await commentService.createComment(taskId, data);
    if (result.success) {
        updateTag(`task-comments-${taskId}`);
        updateTag(`task-${taskId}`);
        updateTag("user-comments");
    }
    return result;
};

// Update a comment
export const updateComment = async (commentId: string, content: string, taskId: string) => {
    // Validate content
    if (!content || content.trim().length === 0) {
        return {
            success: false,
            message: "Comment content cannot be empty",
        };
    }

    // Validate content length
    if (content.length > 5000) {
        return {
            success: false,
            message: "Comment cannot exceed 5000 characters",
        };
    }

    const result = await commentService.updateComment(commentId, content);
    if (result.success) {
        updateTag(`task-comments-${taskId}`);
        updateTag(`comment-${commentId}`);
        updateTag(`task-${taskId}`);
        updateTag("user-comments");
    }
    return result;
};

// Delete a comment
export const deleteComment = async (commentId: string, taskId: string) => {
    const result = await commentService.deleteComment(commentId);
    if (result.success) {
        updateTag(`task-comments-${taskId}`);
        updateTag(`task-${taskId}`);
        updateTag("user-comments");
    }
    return result;
};

// Get comments for a task
export const getTaskComments = async (
    taskId: string,
    params?: {
        page?: number;
        limit?: number;
    }
) => {
    if (!taskId) {
        return {
            success: false,
            message: "Task ID is required",
        };
    }
    return await commentService.getTaskComments(taskId, params);
};

// Get current user's comments
export const getUserComments = async (params?: {
    page?: number;
    limit?: number;
}) => {
    return await commentService.getUserComments(params);
};

// Get comment by ID
export const getCommentById = async (commentId: string) => {
    if (!commentId) {
        return {
            success: false,
            message: "Comment ID is required",
        };
    }
    return await commentService.getCommentById(commentId);
};

// Revalidate comment data
export const revalidateComments = async (taskId: string) => {
    updateTag(`task-comments-${taskId}`);
    updateTag(`task-${taskId}`);
    updateTag("user-comments");
};