import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.AUTH_URL;

export const searchService = {
    // Global search across all entities
    globalSearch: async (
        query: string,
        type?: string,
        params?: {
            page?: number;
            limit?: number;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/search`);

            url.searchParams.set("q", query);
            if (type && type !== "all") url.searchParams.set("type", type);
            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["global-search"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to perform search",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Global search error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Search projects only
    searchProjects: async (
        query: string,
        params?: {
            status?: string;
            page?: number;
            limit?: number;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/search/projects`);

            url.searchParams.set("q", query);
            if (params?.status && params.status !== "all") url.searchParams.set("status", params.status);
            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["search-projects"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to search projects",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Search projects error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Search tasks only
    searchTasks: async (
        query: string,
        params?: {
            status?: string;
            priority?: string;
            projectId?: string;
            page?: number;
            limit?: number;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/search/tasks`);

            url.searchParams.set("q", query);
            if (params?.status && params.status !== "all") url.searchParams.set("status", params.status);
            if (params?.priority && params.priority !== "all") url.searchParams.set("priority", params.priority);
            if (params?.projectId) url.searchParams.set("projectId", params.projectId);
            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["search-tasks"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to search tasks",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Search tasks error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Search members only
    searchMembers: async (
        query: string,
        params?: {
            page?: number;
            limit?: number;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/search/members`);

            url.searchParams.set("q", query);
            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["search-members"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to search members",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Search members error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get search suggestions (autocomplete)
    getSearchSuggestions: async (query: string) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/search/suggestions`);
            url.searchParams.set("q", query);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["search-suggestions"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to get search suggestions",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get search suggestions error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get recent searches
    getRecentSearches: async (limit: number = 10) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/search/recent`);
            url.searchParams.set("limit", limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["recent-searches"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to get recent searches",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get recent searches error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Clear recent searches
    clearRecentSearches: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/search/recent`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to clear recent searches",
                };
            }

            return response;
        } catch (error) {
            console.error("Clear recent searches error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};