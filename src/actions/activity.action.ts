"use server";

import { activityService } from "@/services/activity.service";
import { updateTag } from "next/cache";

// Get all activities
export const getActivities = async (params?: {
    page?: number;
    limit?: number;
    projectId?: string;
    taskId?: string;
    action?: string;
}) => {
    return await activityService.getActivities(params);
};

// Get recent activities (for dashboard)
export const getRecentActivities = async (limit: number = 10) => {
    return await activityService.getRecentActivities(limit);
};

// Get activities for a specific project
export const getProjectActivities = async (
    projectId: string,
    params?: {
        page?: number;
        limit?: number;
    }
) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }
    return await activityService.getProjectActivities(projectId, params);
};

// Get activities for a specific task
export const getTaskActivities = async (
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
    return await activityService.getTaskActivities(taskId, params);
};

// Get current user's activities
export const getUserActivities = async (params?: {
    page?: number;
    limit?: number;
}) => {
    return await activityService.getUserActivities(undefined, params);
};

// Get activities for a specific user (admin only)
export const getSpecificUserActivities = async (
    userId: string,
    params?: {
        page?: number;
        limit?: number;
    }
) => {
    if (!userId) {
        return {
            success: false,
            message: "User ID is required",
        };
    }
    return await activityService.getUserActivities(userId, params);
};

// Get activity statistics
export const getActivityStats = async (days: number = 30) => {
    return await activityService.getActivityStats(days);
};

// Revalidate activity data
export const revalidateActivities = async () => {
    updateTag("activities");
    updateTag("recent-activities");
    updateTag("activity-stats");
};

export const revalidateProjectActivities = async (projectId: string) => {
    updateTag(`project-activities-${projectId}`);
};

export const revalidateTaskActivities = async (taskId: string) => {
    updateTag(`task-activities-${taskId}`);
};

export const revalidateUserActivities = async (userId?: string) => {
    updateTag(`user-activities-${userId || "me"}`);
};