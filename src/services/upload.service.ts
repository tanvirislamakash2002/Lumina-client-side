import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.AUTH_URL;

export const uploadService = {
    // Upload avatar
    uploadAvatar: async (formData: FormData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/upload/avatar`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString(),
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to upload avatar",
                };
            }

            return data;
        } catch (error) {
            console.error("Upload avatar error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Remove avatar
    removeAvatar: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/upload/avatar`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to remove avatar",
                };
            }

            return data;
        } catch (error) {
            console.error("Remove avatar error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Upload task attachment
    uploadTaskAttachment: async (taskId: string, formData: FormData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/upload/task/${taskId}/attachment`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString(),
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to upload attachment",
                };
            }

            return data;
        } catch (error) {
            console.error("Upload task attachment error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Delete task attachment
    deleteTaskAttachment: async (attachmentId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/upload/attachment/${attachmentId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to delete attachment",
                };
            }

            return data;
        } catch (error) {
            console.error("Delete attachment error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Get task attachments
    getTaskAttachments: async (taskId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/upload/task/${taskId}/attachments`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch attachments",
                };
            }

            return data;
        } catch (error) {
            console.error("Get task attachments error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // Upload project image (PM/Admin only)
    uploadProjectImage: async (projectId: string, formData: FormData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/upload/project/${projectId}/image`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString(),
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to upload project image",
                };
            }

            return data;
        } catch (error) {
            console.error("Upload project image error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};