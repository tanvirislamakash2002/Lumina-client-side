"use server";

import { adminService } from "@/services/admin.service";
import { updateTag } from "next/cache";

// ============ Dashboard & Stats ============
export const getAdminDashboard = async () => {
    return await adminService.getDashboard();
};

export const getSystemStats = async () => {
    return await adminService.getSystemStats();
};

// ============ User Management ============
export const getAllUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    verified?: string;
    sort?: string;  
}) => {
    return await adminService.getAllUsers(params);
};

export const getUserDetails = async (userId: string) => {
    if (!userId) {
        return {
            success: false,
            message: "User ID is required",
        };
    }
    return await adminService.getUserDetails(userId);
};

export const updateUserRole = async (userId: string, role: string) => {
    if (!userId) {
        return {
            success: false,
            message: "User ID is required",
        };
    }

    const validRoles = ["ADMIN", "PROJECT_MANAGER", "TEAM_MEMBER"];
    if (!validRoles.includes(role)) {
        return {
            success: false,
            message: "Invalid role",
        };
    }

    const result = await adminService.updateUserRole(userId, role);
    if (result.success) {
        updateTag("admin-users");
        updateTag(`admin-user-${userId}`);
    }
    return result;
};

export const suspendUser = async (userId: string) => {
    if (!userId) {
        return {
            success: false,
            message: "User ID is required",
        };
    }

    const result = await adminService.suspendUser(userId);
    if (result.success) {
        updateTag("admin-users");
        updateTag(`admin-user-${userId}`);
        updateTag("admin-stats");
    }
    return result;
};

export const activateUser = async (userId: string) => {
    if (!userId) {
        return {
            success: false,
            message: "User ID is required",
        };
    }

    const result = await adminService.activateUser(userId);
    if (result.success) {
        updateTag("admin-users");
        updateTag(`admin-user-${userId}`);
        updateTag("admin-stats");
    }
    return result;
};

export const deleteUser = async (userId: string) => {
    if (!userId) {
        return {
            success: false,
            message: "User ID is required",
        };
    }

    const result = await adminService.deleteUser(userId);
    if (result.success) {
        updateTag("admin-users");
        updateTag("admin-stats");
    }
    return result;
};

export const bulkUserAction = async (action: string, userIds: string[]) => {
    if (!action || !userIds || userIds.length === 0) {
        return {
            success: false,
            message: "Action and user IDs are required",
        };
    }

    const validActions = ["suspend", "activate", "delete"];
    if (!validActions.includes(action)) {
        return {
            success: false,
            message: `Invalid action. Valid: ${validActions.join(", ")}`,
        };
    }

    const result = await adminService.bulkUserAction(action, userIds);
    if (result.success) {
        updateTag("admin-users");
        updateTag("admin-stats");
    }
    return result;
};

// ============ Project Management ============
export const getAllProjects = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sort?: string;
}) => {
    return await adminService.getAllProjects(params);
};

export const deleteProject = async (projectId: string) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }

    const result = await adminService.deleteProject(projectId);
    if (result.success) {
        updateTag("admin-projects");
        updateTag("projects");
        updateTag("dashboard");
    }
    return result;
};

// ============ Logs & Audit ============
export const getSystemLogs = async (params?: {
    page?: number;
    limit?: number;
    level?: string;
    days?: number;
}) => {
    return await adminService.getSystemLogs(params);
};

export const getAuditTrail = async (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    days?: number;
}) => {
    return await adminService.getAuditTrail(params);
};

export const getAuditStats = async (days: number = 90) => {
    return await adminService.getAuditStats(days);
};

// ============ System ============
export const clearCache = async () => {
    const result = await adminService.clearCache();
    if (result.success) {
        updateTag("admin-dashboard");
        updateTag("admin-stats");
        updateTag("admin-users");
        updateTag("admin-projects");
        updateTag("system-logs");
        updateTag("audit-trail");
        updateTag("dashboard");
        updateTag("projects");
        updateTag("user-stats");
    }
    return result;
};

// ============ Revalidation Helpers ============
export const revalidateAdminDashboard = async () => {
    updateTag("admin-dashboard");
    updateTag("admin-stats");
};

export const revalidateAdminUsers = async () => {
    updateTag("admin-users");
    updateTag("admin-stats");
};

export const revalidateAdminProjects = async () => {
    updateTag("admin-projects");
};

export const revalidateSystemLogs = async () => {
    updateTag("system-logs");
};

export const revalidateAuditTrail = async () => {
    updateTag("audit-trail");
};