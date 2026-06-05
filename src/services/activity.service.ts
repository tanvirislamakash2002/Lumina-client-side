import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.AUTH_URL;

export const activityService = {
    // Get all activities (with filters and pagination)
    getActivities: async (params?: {
        page?: number;
        limit?: number;
        projectId?: string;
        taskId?: string;
        action?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/activities`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.projectId) url.searchParams.set("projectId", params.projectId);
            if (params?.taskId) url.searchParams.set("taskId", params.taskId);
            if (params?.action && params.action !== "all") url.searchParams.set("action", params.action);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["activities"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch activities",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get activities error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get recent activities (for dashboard)
    getRecentActivities: async (limit: number = 10) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/activities/recent`);
            url.searchParams.set("limit", limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["recent-activities"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch recent activities",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get recent activities error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get activities for a specific project
    getProjectActivities: async (
        projectId: string,
        params?: {
            page?: number;
            limit?: number;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/activities/project/${projectId}`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`project-activities-${projectId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch project activities",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get project activities error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get activities for a specific task
    getTaskActivities: async (
        taskId: string,
        params?: {
            page?: number;
            limit?: number;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/activities/task/${taskId}`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`task-activities-${taskId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch task activities",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get task activities error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get activities for a specific user
    getUserActivities: async (
        userId?: string,
        params?: {
            page?: number;
            limit?: number;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/activities/user/me`);

            // If userId is provided and different, use the admin endpoint
            if (userId) {
                url.pathname = `/activities/user/${userId}`;
            }

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`user-activities-${userId || "me"}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch user activities",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get user activities error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get activity statistics
    getActivityStats: async (days: number = 30) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/activities/stats`);
            url.searchParams.set("days", days.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["activity-stats"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch activity stats",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get activity stats error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};