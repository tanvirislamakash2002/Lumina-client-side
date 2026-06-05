import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const userService = {
    // Get current user profile
    getProfile: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/users/me`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["user-profile"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch profile",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get profile error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Update user profile
    updateProfile: async (data: { name?: string; image?: string }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/users/me`, {
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
                    message: response.message || "Failed to update profile",
                };
            }

            return response;
        } catch (error) {
            console.error("Update profile error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Change password
    changePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/users/me/change-password`, {
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
                    message: response.message || "Failed to change password",
                };
            }

            return response;
        } catch (error) {
            console.error("Change password error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Delete account
    deleteAccount: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/users/me`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to delete account",
                };
            }

            return response;
        } catch (error) {
            console.error("Delete account error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get user workload (tasks assigned to current user)
    getUserWorkload: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/users/me/workload`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["user-workload"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch workload",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get user workload error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get all users (admin only)
    getAllUsers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/users`);

            if (params?.page) url.searchParams.set("page", params.page.toString());
            if (params?.limit) url.searchParams.set("limit", params.limit.toString());
            if (params?.search) url.searchParams.set("search", params.search);
            if (params?.role && params.role !== "all") url.searchParams.set("role", params.role);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["all-users"] },
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

    // Get user by ID (admin only)
    getUserById: async (userId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/users/${userId}`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: [`user-${userId}`] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch user",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get user by ID error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Update user role (admin only)
    updateUserRole: async (userId: string, role: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/users/${userId}/role`, {
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

    // Get team members (for task assignment dropdown)
    getTeamMembers: async (search?: string, limit: number = 50) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/users/members`);

            if (search) url.searchParams.set("search", search);
            if (limit) url.searchParams.set("limit", limit.toString());

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["team-members"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch team members",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get team members error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
    getTeamMembersWithProjects: async (
    currentUserId: string,
    userRole: string,
    params?: {
        projectId?: string;
        search?: string;
    }
) => {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/users/team-members`);

        // Add query parameters
        if (params?.projectId) url.searchParams.set("projectId", params.projectId);
        if (params?.search) url.searchParams.set("search", params.search);
        
        // Add user context
        url.searchParams.set("currentUserId", currentUserId);
        url.searchParams.set("userRole", userRole);

        const res = await fetch(url.toString(), {
            headers: {
                Cookie: cookieStore.toString(),
            },
            next: { tags: ["team-members"] },
        });
        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Failed to fetch team members",
            };
        }

        return {
            success: true,
            data: data.data,
        };
    } catch (error) {
        console.error("Get team members with projects error:", error);
        return {
            success: false,
            message: "Something went wrong",
        };
    }
},
};

