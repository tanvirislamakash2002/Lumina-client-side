import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const projectMemberService = {
    // Add member to project
    addMember: async (projectId: string, memberId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/project-members/${projectId}/members`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify({ memberId }),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to add member",
                };
            }

            return response;
        } catch (error) {
            console.error("Add member error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Remove member from project
    removeMember: async (projectId: string, memberId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/project-members/${projectId}/members/${memberId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to remove member",
                };
            }

            return response;
        } catch (error) {
            console.error("Remove member error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get project members (with pagination and search)
    getProjectMembers: async (
        projectId: string,
        params?: {
            page?: number;
            limit?: number;
            search?: string;
        }
    ) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/project-members/${projectId}/members`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.search) url.searchParams.set("search", params.search);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`project-members-${projectId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch project members",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get project members error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Check if current user is a member of the project
    checkMembership: async (projectId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/project-members/${projectId}/members/check`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`membership-${projectId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to check membership",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Check membership error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get current user's projects
    getUserProjects: async (params?: {
        page?: number;
        limit?: number;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/project-members/user/projects`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["user-projects"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch user projects",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get user projects error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get available members (users not yet in project)
    getAvailableMembers: async (projectId: string, search?: string, limit: number = 20) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/project-members/${projectId}/members/available`);

            if (search) url.searchParams.set("search", search);
            if (limit) url.searchParams.set("limit", limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`available-members-${projectId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch available members",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get available members error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};