"use server";

import { settingsService } from "@/services/settings.service";
import { updateTag } from "next/cache";

// ============ General Settings (Admin Only) ============
export const getGeneralSettings = async () => {
    return await settingsService.getGeneralSettings();
};

export const updateGeneralSettings = async (settings: {
    siteName?: string;
    siteDescription?: string;
    contactEmail?: string;
    timezone?: string;
    dateFormat?: string;
}) => {
    const result = await settingsService.updateGeneralSettings(settings);
    if (result.success) {
        updateTag("general-settings");
    }
    return result;
};

// ============ Notification Settings ============
export const getNotificationSettings = async () => {
    return await settingsService.getNotificationSettings();
};

export const updateNotificationSettings = async (settings: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    taskAssigned?: boolean;
    taskStatusChanged?: boolean;
    taskDueSoon?: boolean;
    taskOverdue?: boolean;
    commentAdded?: boolean;
    mentioned?: boolean;
    projectInvite?: boolean;
    weeklyDigest?: boolean;
}) => {
    const result = await settingsService.updateNotificationSettings(settings);
    if (result.success) {
        updateTag("notification-settings");
    }
    return result;
};

// ============ Theme Settings ============
export const getThemeSettings = async () => {
    return await settingsService.getThemeSettings();
};

export const updateThemeSettings = async (settings: {
    theme?: "light" | "dark" | "system";
    sidebarCollapsed?: boolean;
    fontSize?: "small" | "medium" | "large";
    compactView?: boolean;
}) => {
    const result = await settingsService.updateThemeSettings(settings);
    if (result.success) {
        updateTag("theme-settings");
    }
    return result;
};

// ============ Security Settings ============
export const getSecuritySettings = async () => {
    return await settingsService.getSecuritySettings();
};

export const updateSecuritySettings = async (settings: {
    twoFactorEnabled?: boolean;
    sessionTimeout?: number;
    loginNotifications?: boolean;
}) => {
    const result = await settingsService.updateSecuritySettings(settings);
    if (result.success) {
        updateTag("security-settings");
    }
    return result;
};

// ============ Session Management ============
export const getSessions = async () => {
    return await settingsService.getSessions();
};

export const revokeSession = async (sessionId: string) => {
    if (!sessionId) {
        return {
            success: false,
            message: "Session ID is required",
        };
    }

    const result = await settingsService.revokeSession(sessionId);
    if (result.success) {
        updateTag("user-sessions");
    }
    return result;
};

export const revokeAllSessions = async () => {
    const result = await settingsService.revokeAllSessions();
    if (result.success) {
        updateTag("user-sessions");
    }
    return result;
};

// ============ System Settings (Admin Only) ============
export const getSystemSettings = async () => {
    return await settingsService.getSystemSettings();
};

export const updateSystemSettings = async (settings: {
    maintenanceMode?: boolean;
    allowRegistration?: boolean;
    requireEmailVerification?: boolean;
    defaultUserRole?: string;
    maxProjectPerUser?: number;
    maxFileSize?: number;
    allowedFileTypes?: string[];
}) => {
    const result = await settingsService.updateSystemSettings(settings);
    if (result.success) {
        updateTag("system-settings");
    }
    return result;
};

// ============ Revalidation Helpers ============
export const revalidateGeneralSettings = async () => {
    updateTag("general-settings");
};

export const revalidateNotificationSettings = async () => {
    updateTag("notification-settings");
};

export const revalidateThemeSettings = async () => {
    updateTag("theme-settings");
};

export const revalidateSecuritySettings = async () => {
    updateTag("security-settings");
};

export const revalidateUserSessions = async () => {
    updateTag("user-sessions");
};

export const revalidateSystemSettings = async () => {
    updateTag("system-settings");
};

export const revalidateAllSettings = async () => {
    updateTag("general-settings");
    updateTag("notification-settings");
    updateTag("theme-settings");
    updateTag("security-settings");
    updateTag("user-sessions");
    updateTag("system-settings");
};