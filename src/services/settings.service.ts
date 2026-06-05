import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const settingsService = {
    // ============ General Settings (Admin Only) ============
    getGeneralSettings: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/general`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["general-settings"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch general settings",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get general settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    updateGeneralSettings: async (settings: {
        siteName?: string;
        siteDescription?: string;
        contactEmail?: string;
        timezone?: string;
        dateFormat?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/general`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(settings),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update general settings",
                };
            }

            return response;
        } catch (error) {
            console.error("Update general settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // ============ Notification Settings ============
    getNotificationSettings: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/notifications`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["notification-settings"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch notification settings",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get notification settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    updateNotificationSettings: async (settings: {
        emailNotifications?: boolean;
        pushNotifications?: boolean;
        taskAssigned?: boolean;
        taskStatusChanged?: boolean;
        taskDueSoon?: boolean;
        taskOverdue?: boolean;
        commentAdded?: boolean;
        mentioned?: boolean;
        projectInvite?: boolean;
        weeklyDigest?: boolean;
    }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/notifications`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(settings),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update notification settings",
                };
            }

            return response;
        } catch (error) {
            console.error("Update notification settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // ============ Theme Settings ============
    getThemeSettings: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/theme`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["theme-settings"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch theme settings",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get theme settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    updateThemeSettings: async (settings: {
        theme?: "light" | "dark" | "system";
        sidebarCollapsed?: boolean;
        fontSize?: "small" | "medium" | "large";
        compactView?: boolean;
    }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/theme`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(settings),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update theme settings",
                };
            }

            return response;
        } catch (error) {
            console.error("Update theme settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // ============ Security Settings ============
    getSecuritySettings: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/security`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["security-settings"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch security settings",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get security settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    updateSecuritySettings: async (settings: {
        twoFactorEnabled?: boolean;
        sessionTimeout?: number;
        loginNotifications?: boolean;
    }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/security`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(settings),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update security settings",
                };
            }

            return response;
        } catch (error) {
            console.error("Update security settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // ============ Session Management ============
    getSessions: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/sessions`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["user-sessions"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch sessions",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get sessions error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    revokeSession: async (sessionId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/sessions/${sessionId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to revoke session",
                };
            }

            return response;
        } catch (error) {
            console.error("Revoke session error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    revokeAllSessions: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/sessions`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to revoke all sessions",
                };
            }

            return response;
        } catch (error) {
            console.error("Revoke all sessions error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    // ============ System Settings (Admin Only) ============
    getSystemSettings: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/system`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                next: { tags: ["system-settings"] },
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch system settings",
                };
            }

            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error("Get system settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },

    updateSystemSettings: async (settings: {
        maintenanceMode?: boolean;
        allowRegistration?: boolean;
        requireEmailVerification?: boolean;
        defaultUserRole?: string;
        maxProjectPerUser?: number;
        maxFileSize?: number;
        allowedFileTypes?: string[];
    }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/settings/system`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(settings),
            });

            const response = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: response.message || "Failed to update system settings",
                };
            }

            return response;
        } catch (error) {
            console.error("Update system settings error:", error);
            return {
                success: false,
                message: "Something went wrong",
            };
        }
    },
};