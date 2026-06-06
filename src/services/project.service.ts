import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const projectService = {
    // Create a new project
    createProject: async (data: {
        name: string;
        description?: string;
        deadline?: string;
        status?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/projects`, {
                method: "POST",
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
                    message: response.message || "Failed to create project",
                };
            }

            return response;
        } catch (error) {
            console.error("Create project error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get all projects (with filters and pagination)
    getProjects: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        sortBy?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/projects`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.search) url.searchParams.set("search", params.search);
            if (params?.status && params.status !== "all") url.searchParams.set("status", params.status);
            if (params?.sortBy) url.searchParams.set("sortBy", params.sortBy);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["projects"] },
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
            console.error("Get projects error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get project by ID
    getProjectById: async (projectId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/projects/${projectId}`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`project-${projectId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch project",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get project by ID error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Update project
    updateProject: async (
        projectId: string,
        data: {
            name?: string;
            description?: string;
            deadline?: string;
            status?: string;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/projects/${projectId}`, {
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
                    message: response.message || "Failed to update project",
                };
            }

            return response;
        } catch (error) {
            console.error("Update project error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Delete project
    deleteProject: async (projectId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/projects/${projectId}`, {
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

    bulkDeleteProjects: async (projectIds: string[]) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/projects/bulk-delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify({ projectIds }),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to delete projects",
                };
            }

            return response;
        } catch (error) {
            console.error("Bulk delete projects error:", error);
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
            const res = await fetch(`${API_URL}/projects/${projectId}/stats`, {
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

    // Get project progress (for chart)
    getProjectProgress: async (projectId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/projects/${projectId}/progress`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`project-progress-${projectId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch project progress",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get project progress error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};