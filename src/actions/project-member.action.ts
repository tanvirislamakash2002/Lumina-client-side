"use server";

import { projectMemberService } from "@/services/project-member.service";
import { updateTag } from "next/cache";

// Add member to project
export const addMember = async (projectId: string, memberId: string) => {
    if (!projectId || !memberId) {
        return {
            success: false,
            message: "Project ID and Member ID are required",
        };
    }

    const result = await projectMemberService.addMember(projectId, memberId);
    if (result.success) {
        updateTag(`project-members-${projectId}`);
        updateTag(`available-members-${projectId}`);
        updateTag(`project-${projectId}`);
        updateTag("user-projects");
    }
    return result;
};

// Remove member from project
export const removeMember = async (projectId: string, memberId: string) => {
    if (!projectId || !memberId) {
        return {
            success: false,
            message: "Project ID and Member ID are required",
        };
    }

    const result = await projectMemberService.removeMember(projectId, memberId);
    if (result.success) {
        updateTag(`project-members-${projectId}`);
        updateTag(`available-members-${projectId}`);
        updateTag(`project-${projectId}`);
        updateTag(`user-${memberId}-projects`);
        updateTag("user-projects");
    }
    return result;
};

// Get project members
export const getProjectMembers = async (
    projectId: string,
    params?: {
        page?: number;
        limit?: number;
        search?: string;
    }
) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }
    return await projectMemberService.getProjectMembers(projectId, params);
};

// Check if current user is a member
export const checkMembership = async (projectId: string) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }
    return await projectMemberService.checkMembership(projectId);
};

// Get current user's projects
export const getUserProjects = async (params?: {
    page?: number;
    limit?: number;
}) => {
    return await projectMemberService.getUserProjects(params);
};

// Get available members for adding to project
export const getAvailableMembers = async (projectId: string, search?: string, limit?: number) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }
    return await projectMemberService.getAvailableMembers(projectId, search, limit);
};

// Revalidate project member data
export const revalidateProjectMembers = async (projectId: string) => {
    updateTag(`project-members-${projectId}`);
    updateTag(`available-members-${projectId}`);
    updateTag(`project-${projectId}`);
    updateTag("user-projects");
};