"use server";

import { statsService } from "@/services/stats.service";
import { updateTag } from "next/cache";

// Get platform-wide statistics (public)
export const getPlatformStats = async () => {
    return await statsService.getPlatformStats();
};

// Get current user's statistics
export const getUserStats = async () => {
    return await statsService.getUserStats();
};

// Get specific user's statistics (admin only)
export const getUserStatsById = async (userId: string) => {
    if (!userId) {
        return {
            success: false,
            message: "User ID is required",
        };
    }
    return await statsService.getUserStatsById(userId);
};

// Get project statistics
export const getProjectStats = async (projectId: string) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }
    return await statsService.getProjectStats(projectId);
};

// Get task statistics
export const getTaskStats = async (taskId: string) => {
    if (!taskId) {
        return {
            success: false,
            message: "Task ID is required",
        };
    }
    return await statsService.getTaskStats(taskId);
};

// Get team statistics (admin and PM only)
export const getTeamStats = async () => {
    return await statsService.getTeamStats();
};

// Get activity statistics
export const getActivityStats = async (days: number = 30) => {
    return await statsService.getActivityStats(days);
};

// Get completion statistics
export const getCompletionStats = async () => {
    return await statsService.getCompletionStats();
};

// Revalidate all stats
export const revalidateStats = async () => {
    updateTag("platform-stats");
    updateTag("user-stats");
    updateTag("team-stats");
    updateTag("activity-stats");
    updateTag("completion-stats");
};

// Revalidate specific stats
export const revalidatePlatformStats = async () => {
    updateTag("platform-stats");
};

export const revalidateUserStats = async () => {
    updateTag("user-stats");
};

export const revalidateProjectStats = async (projectId: string) => {
    updateTag(`project-stats-${projectId}`);
};

export const revalidateTaskStats = async (taskId: string) => {
    updateTag(`task-stats-${taskId}`);
};

export const revalidateTeamStats = async () => {
    updateTag("team-stats");
};

export const revalidateActivityStats = async () => {
    updateTag("activity-stats");
};

export const revalidateCompletionStats = async () => {
    updateTag("completion-stats");
};