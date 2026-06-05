"use server";

import { userService } from "@/services/user.service";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

// Get current user profile
export const getProfile = async () => {
    return await userService.getProfile();
};

// Update user profile
export const updateProfile = async (data: { name?: string; image?: string }) => {
    const result = await userService.updateProfile(data);
    if (result.success) {
        updateTag("user-profile");
        updateTag("current-user");
    }
    return result;
};

// Change password
export const changePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    // Validate password match
    if (data.newPassword !== data.confirmPassword) {
        return {
            success: false,
            message: "New passwords do not match",
        };
    }

    // Validate password length
    if (data.newPassword.length < 6) {
        return {
            success: false,
            message: "Password must be at least 6 characters",
        };
    }

    return await userService.changePassword(data);
};

// Delete account
export const deleteAccount = async () => {
    const result = await userService.deleteAccount();
    if (result.success) {
        redirect("/logout");
    }
    return result;
};

// Get user workload
export const getUserWorkload = async () => {
    return await userService.getUserWorkload();
};

// Get all users (admin only)
export const getAllUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
}) => {
    return await userService.getAllUsers(params);
};

// Get user by ID (admin only)
export const getUserById = async (userId: string) => {
    return await userService.getUserById(userId);
};

// Update user role (admin only)
export const updateUserRole = async (userId: string, role: string) => {
    const result = await userService.updateUserRole(userId, role);
    if (result.success) {
        updateTag("all-users");
        updateTag(`user-${userId}`);
    }
    return result;
};

// Get team members (for dropdowns)
export const getTeamMembers = async (search?: string, limit?: number) => {
    return await userService.getTeamMembers(search, limit);
};

export const getTeamMembersWithProjects = async (
    currentUserId: string,
    userRole: string,
    params?: {
        projectId?: string;
        search?: string;
    }
) => {
    return await userService.getTeamMembersWithProjects(currentUserId, userRole, params);
};

// Revalidate user data
export const revalidateUser = async () => {
    updateTag("user-profile");
    updateTag("user-workload");
    updateTag("current-user");
};