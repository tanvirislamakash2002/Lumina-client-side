import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const taskService = {
    // Create a new task
    createTask: async (
        projectId: string,
        data: {
            title: string;
            description?: string;
            assignedTo?: string;
            dueDate?: string;
            priority?: string;
            status?: string;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tasks/project/${projectId}`, {
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
                    message: response.message || "Failed to create task",
                };
            }

            return response;
        } catch (error) {
            console.error("Create task error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get tasks for a project (with filters and pagination)
    getTasks: async (
        projectId: string,
        params?: {
            page?: number;
            limit?: number;
            search?: string;
            status?: string;
            priority?: string;
            assignedTo?: string;
            sortBy?: string;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/tasks/project/${projectId}`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.search) url.searchParams.set("search", params.search);
            if (params?.status && params.status !== "all") url.searchParams.set("status", params.status);
            if (params?.priority && params.priority !== "all") url.searchParams.set("priority", params.priority);
            if (params?.assignedTo && params.assignedTo !== "all") url.searchParams.set("assignedTo", params.assignedTo);
            if (params?.sortBy) url.searchParams.set("sortBy", params.sortBy);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`project-tasks-${projectId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch tasks",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get tasks error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get task by ID
    getTaskById: async (taskId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tasks/${taskId}`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`task-${taskId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch task",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get task by ID error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Update task
    updateTask: async (
        taskId: string,
        data: {
            title?: string;
            description?: string;
            assignedTo?: string | null;
            dueDate?: string;
            priority?: string;
            status?: string;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tasks/${taskId}`, {
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
                    message: response.message || "Failed to update task",
                };
            }

            return response;
        } catch (error) {
            console.error("Update task error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Delete task
    deleteTask: async (taskId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to delete task",
                };
            }

            return response;
        } catch (error) {
            console.error("Delete task error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Update task status (quick action)
    updateTaskStatus: async (taskId: string, status: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tasks/${taskId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify({ status }),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update task status",
                };
            }

            return response;
        } catch (error) {
            console.error("Update task status error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get tasks assigned to current user
    getMyTasks: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        projectId?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/tasks/my-tasks`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.status && params.status !== "all") url.searchParams.set("status", params.status);
            if (params?.projectId) url.searchParams.set("projectId", params.projectId);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["my-tasks"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch your tasks",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get my tasks error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get overdue tasks
    getOverdueTasks: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tasks/overdue`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["overdue-tasks"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch overdue tasks",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get overdue tasks error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};