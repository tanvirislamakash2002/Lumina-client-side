import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.AUTH_URL;

export const filterService = {
    // Get all filter options (statuses, priorities, members, etc.)
    getFilterOptions: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/filters/options`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["filter-options"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch filter options",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get filter options error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get task-specific filter options
    getTaskFilters: async (projectId?: string) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/filters/tasks`);
            
            if (projectId) url.searchParams.set("projectId", projectId);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["task-filters", projectId ? `task-filters-${projectId}` : "task-filters-global"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch task filters",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get task filters error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get project-specific filter options
    getProjectFilters: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/filters/projects`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["project-filters"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch project filters",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get project filters error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get member-specific filter options
    getMemberFilters: async (projectId?: string) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/filters/members`);
            
            if (projectId) url.searchParams.set("projectId", projectId);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["member-filters", projectId ? `member-filters-${projectId}` : "member-filters-global"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch member filters",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get member filters error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get saved filters for current user
    getSavedFilters: async (type?: string) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/filters/saved`);
            
            if (type) url.searchParams.set("type", type);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["saved-filters"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch saved filters",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get saved filters error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Save a filter
    saveFilter: async (name: string, type: "task" | "project" | "member", filters: Record<string, any>) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/filters/saved`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify({ name, type, filters }),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to save filter",
                };
            }

            return response;
        } catch (error) {
            console.error("Save filter error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Update a saved filter
    updateSavedFilter: async (filterId: string, data: { name?: string; filters?: Record<string, any> }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/filters/saved/${filterId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(data),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update filter",
                };
            }

            return response;
        } catch (error) {
            console.error("Update saved filter error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Delete a saved filter
    deleteSavedFilter: async (filterId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/filters/saved/${filterId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to delete filter",
                };
            }

            return response;
        } catch (error) {
            console.error("Delete saved filter error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};