import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const statsService = {
    // Get platform-wide statistics (public)
    getPlatformStats: async () => {
        try {
            const res = await fetch(`${API_URL}/stats/platform`, {
                next: { tags: ["platform-stats"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch platform stats",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get platform stats error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get current user's statistics
    getUserStats: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/stats/user`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["user-stats"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch user stats",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get user stats error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get specific user's statistics (admin only)
    getUserStatsById: async (userId: string) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/stats/user`);
            url.searchParams.set("userId", userId);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`user-stats-${userId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch user stats",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get user stats by ID error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get project statistics
    getProjectStats: async (projectId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/stats/project/${projectId}`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`project-stats-${projectId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch project stats",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get project stats error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get task statistics
    getTaskStats: async (taskId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/stats/task/${taskId}`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`task-stats-${taskId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch task stats",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get task stats error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get team statistics (admin and PM only)
    getTeamStats: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/stats/team`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["team-stats"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch team stats",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get team stats error:", error);
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
            const url = new URL(`${API_URL}/stats/activities`);
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

    // Get completion statistics
    getCompletionStats: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/stats/completion`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["completion-stats"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch completion stats",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get completion stats error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};