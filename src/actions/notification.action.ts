"use server";

import { notificationService } from "@/services/notification.service";
import { updateTag } from "next/cache";

// Get all notifications
export const getNotifications = async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
}) => {
    return await notificationService.getNotifications(params);
};

// Get unread notification count (for badge)
export const getUnreadCount = async () => {
    return await notificationService.getUnreadCount();
};

// Mark a single notification as read
export const markAsRead = async (notificationId: string) => {
    const result = await notificationService.markAsRead(notificationId);
    if (result.success) {
        updateTag("notifications");
        updateTag("unread-count");
    }
    return result;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
    const result = await notificationService.markAllAsRead();
    if (result.success) {
        updateTag("notifications");
        updateTag("unread-count");
    }
    return result;
};

// Delete a single notification
export const deleteNotification = async (notificationId: string) => {
    const result = await notificationService.deleteNotification(notificationId);
    if (result.success) {
        updateTag("notifications");
        updateTag("unread-count");
    }
    return result;
};

// Delete all read notifications
export const deleteAllRead = async () => {
    const result = await notificationService.deleteAllRead();
    if (result.success) {
        updateTag("notifications");
        updateTag("unread-count");
    }
    return result;
};

// Get notification settings
export const getNotificationSettings = async () => {
    return await notificationService.getNotificationSettings();
};

// Update notification settings
export const updateNotificationSettings = async (settings: {
    taskAssigned?: boolean;
    taskStatusChanged?: boolean;
    taskDueSoon?: boolean;
    taskOverdue?: boolean;
    commentAdded?: boolean;
    mentioned?: boolean;
    projectInvite?: boolean;
}) => {
    const result = await notificationService.updateNotificationSettings(settings);
    if (result.success) {
        updateTag("notification-settings");
    }
    return result;
};

// Revalidate notification data
export const revalidateNotifications = async () => {
    updateTag("notifications");
    updateTag("unread-count");
    updateTag("notification-settings");
};