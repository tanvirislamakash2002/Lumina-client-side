import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const commentService = {
    // Create a comment or reply
    createComment: async (taskId: string, data: { content: string; parentId?: string | null }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/comments/task/${taskId}`, {
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
                    message: response.message || "Failed to create comment",
                };
            }

            return response;
        } catch (error) {
            console.error("Create comment error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Update a comment
    updateComment: async (commentId: string, content: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify({ content }),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update comment",
                };
            }

            return response;
        } catch (error) {
            console.error("Update comment error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Delete a comment
    deleteComment: async (commentId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to delete comment",
                };
            }

            return response;
        } catch (error) {
            console.error("Delete comment error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get comments for a task (with pagination)
    getTaskComments: async (
        taskId: string,
        params?: {
            page?: number;
            limit?: number;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/comments/task/${taskId}`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`task-comments-${taskId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch comments",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get task comments error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get current user's comments
    getUserComments: async (params?: {
        page?: number;
        limit?: number;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/comments/user/my-comments`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["user-comments"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch your comments",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get user comments error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get comment by ID
    getCommentById: async (commentId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/comments/${commentId}`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`comment-${commentId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch comment",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get comment by ID error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};