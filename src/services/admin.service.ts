import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const adminService = {
    // ============ Dashboard & Stats ============
    getDashboard: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/dashboard`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["admin-dashboard"] },
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
            console.error("Get admin dashboard error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    getSystemStats: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/stats`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["admin-stats"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch system stats",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get system stats error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // ============ User Management ============
    getAllUsers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
        verified?: string;
        sort?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/admin/users`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.search) url.searchParams.set("search", params.search);
            if (params?.role && params.role !== "all") url.searchParams.set("role", params.role);
            if (params?.status && params.status !== "all") url.searchParams.set("status", params.status);
            if (params?.verified && params.verified !== "all") url.searchParams.set("verified", params.verified);
            if (params?.sort) url.searchParams.set("sort", params.sort);
            
            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["admin-users"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch users",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get all users error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    getUserDetails: async (userId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`admin-user-${userId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch user details",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get user details error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    updateUserRole: async (userId: string, role: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify({ role }),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update user role",
                };
            }

            return response;
        } catch (error) {
            console.error("Update user role error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    suspendUser: async (userId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/users/${userId}/suspend`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to suspend user",
                };
            }

            return response;
        } catch (error) {
            console.error("Suspend user error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    activateUser: async (userId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/users/${userId}/activate`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to activate user",
                };
            }

            return response;
        } catch (error) {
            console.error("Activate user error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    deleteUser: async (userId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to delete user",
                };
            }

            return response;
        } catch (error) {
            console.error("Delete user error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    bulkUserAction: async (action: string, userIds: string[]) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/users/bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify({ action, userIds }),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || `Failed to ${action} users`,
                };
            }

            return response;
        } catch (error) {
            console.error("Bulk user action error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // ============ Project Management ============
    getAllProjects: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        sort?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/admin/projects`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.search) url.searchParams.set("search", params.search);
            if (params?.status && params.status !== "all") url.searchParams.set("status", params.status);
            if (params?.sort) url.searchParams.set("sort", params.sort);
            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["admin-projects"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch projects",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get all projects error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    deleteProject: async (projectId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/projects/${projectId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to delete project",
                };
            }

            return response;
        } catch (error) {
            console.error("Delete project error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // ============ Logs & Audit ============
    getSystemLogs: async (params?: {
        page?: number;
        limit?: number;
        level?: string;
        days?: number;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/admin/logs`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.level && params.level !== "all") url.searchParams.set("level", params.level);
            if (params?.days) url.searchParams.set("days", params.days.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["system-logs"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch system logs",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get system logs error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    getAuditTrail: async (params?: {
        page?: number;
        limit?: number;
        userId?: string;
        action?: string;
        days?: number;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/admin/audit`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.userId) url.searchParams.set("userId", params.userId);
            if (params?.action && params.action !== "all") url.searchParams.set("action", params.action);
            if (params?.days) url.searchParams.set("days", params.days.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["audit-trail"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch audit trail",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get audit trail error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    getAuditStats: async (days: number = 90) => {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/admin/audit/stats`);
        url.searchParams.set("days", days.toString());

        const res = await fetch(url.toString(), {
            headers: {
                Cookie: cookieStore.toString(),
            },
            next: { tags: ["audit-stats"] },
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Failed to fetch audit stats",
            };
        }

        return {
            success: true,
            data: data.data,
        };
    } catch (error) {
        console.error("Get audit stats error:", error);
        return {
            success: false,
            message: "Something went wrong",
        };
    }
},

    // ============ System ============
    clearCache: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/cache/clear`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to clear cache",
                };
            }

            return response;
        } catch (error) {
            console.error("Clear cache error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};