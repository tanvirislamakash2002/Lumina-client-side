import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const dashboardService = {
    // Get complete dashboard data (all sections)
    getDashboard: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/dashboard`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["dashboard"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch dashboard data",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get dashboard error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get KPI cards only (total projects, tasks, completion rate, etc.)
    getKPICards: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/dashboard/kpi`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["dashboard-kpi"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch KPI data",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get KPI cards error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get project summaries with progress
    getProjectSummaries: async (limit: number = 5) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/dashboard/projects`);
            url.searchParams.set("limit", limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["dashboard-projects"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch project summaries",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get project summaries error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get upcoming deadlines
    getUpcomingDeadlines: async (limit: number = 10) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/dashboard/deadlines`);
            url.searchParams.set("limit", limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["dashboard-deadlines"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch upcoming deadlines",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get upcoming deadlines error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get high priority tasks
    getHighPriorityTasks: async (limit: number = 5) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/dashboard/high-priority`);
            url.searchParams.set("limit", limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["dashboard-high-priority"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch high priority tasks",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get high priority tasks error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get member workload summary
    getMemberWorkload: async (projectId?: string, limit: number = 10) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/dashboard/workload`);

            if (projectId) url.searchParams.set("projectId", projectId);
            url.searchParams.set("limit", limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["dashboard-workload"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch member workload",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get member workload error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get charts data (tasks by priority, status, trends)
    getCharts: async (days: number = 30) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/dashboard/charts`);
            url.searchParams.set("days", days.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["dashboard-charts"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch chart data",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get charts error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get recent activities (for dashboard feed)
    getRecentActivities: async (limit: number = 10) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/dashboard/activities`);
            url.searchParams.set("limit", limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["dashboard-activities"] },
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
};