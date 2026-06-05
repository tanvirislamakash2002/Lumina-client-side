import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const notificationService = {
    // Get all notifications (with filters and pagination)
    getNotifications: async (params?: {
        page?: number;
        limit?: number;
        type?: string;
        isRead?: boolean;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/notifications`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.type && params.type !== "all") url.searchParams.set("type", params.type);
            if (params?.isRead !== undefined) url.searchParams.set("isRead", params.isRead.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["notifications"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch notifications",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get notifications error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get unread notification count (for badge)
    getUnreadCount: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/notifications/unread-count`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["unread-count"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch unread count",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get unread count error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Mark a single notification as read
    markAsRead: async (notificationId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
                method: "PATCH",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to mark as read",
                };
            }

            return response;
        } catch (error) {
            console.error("Mark as read error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/notifications/read-all`, {
                method: "PATCH",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to mark all as read",
                };
            }

            return response;
        } catch (error) {
            console.error("Mark all as read error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Delete a single notification
    deleteNotification: async (notificationId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/notifications/${notificationId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to delete notification",
                };
            }

            return response;
        } catch (error) {
            console.error("Delete notification error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Delete all read notifications
    deleteAllRead: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/notifications/read/all`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to delete read notifications",
                };
            }

            return response;
        } catch (error) {
            console.error("Delete all read error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get notification settings
    getNotificationSettings: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/notifications/settings`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["notification-settings"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch notification settings",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get notification settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Update notification settings
    updateNotificationSettings: async (settings: {
        taskAssigned?: boolean;
        taskStatusChanged?: boolean;
        taskDueSoon?: boolean;
        taskOverdue?: boolean;
        commentAdded?: boolean;
        mentioned?: boolean;
        projectInvite?: boolean;
    }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/notifications/settings`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(settings),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update notification settings",
                };
            }

            return response;
        } catch (error) {
            console.error("Update notification settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};