"use server";

import { projectService } from "@/services/project.service";
import { updateTag } from "next/cache";

// Create a new project
export const createProject = async (data: {
    name: string;
    description?: string;
    deadline?: string;
    status?: string;
}) => {
    // Validate name
    if (!data.name || data.name.trim().length < 3) {
        return {
            success: false,
            message: "Project name must be at least 3 characters",
        };
    }

    // Validate deadline
    if (data.deadline && new Date(data.deadline) < new Date()) {
        return {
            success: false,
            message: "Deadline cannot be in the past",
        };
    }

    const result = await projectService.createProject(data);
    if (result.success) {
        updateTag("projects");
        updateTag("dashboard");
    }
    return result;
};

// Get all projects
export const getProjects = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
}) => {
    return await projectService.getProjects(params);
};

// Get project by ID
export const getProjectById = async (projectId: string) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }
    return await projectService.getProjectById(projectId);
};

// Update project
export const updateProject = async (
    projectId: string,
    data: {
        name?: string;
        description?: string;
        deadline?: string;
        status?: string;
    }
) => {
    // Validate deadline if provided
    if (data.deadline && new Date(data.deadline) < new Date()) {
        return {
            success: false,
            message: "Deadline cannot be in the past",
        };
    }

    const result = await projectService.updateProject(projectId, data);
    if (result.success) {
        updateTag("projects");
        updateTag(`project-${projectId}`);
        updateTag(`project-stats-${projectId}`);
        updateTag(`project-progress-${projectId}`);
        updateTag("dashboard");
    }
    return result;
};

// Delete project
export const deleteProject = async (projectId: string) => {
    const result = await projectService.deleteProject(projectId);
    if (result.success) {
        updateTag("projects");
        updateTag("dashboard");
    }
    return result;
};

// Get project statistics
export const getProjectStats = async (projectId: string) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }
    return await projectService.getProjectStats(projectId);
};

// Get project progress
export const getProjectProgress = async (projectId: string) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }
    return await projectService.getProjectProgress(projectId);
};

// Revalidate project data
export const revalidateProject = async (projectId: string) => {
    updateTag("projects");
    updateTag(`project-${projectId}`);
    updateTag(`project-stats-${projectId}`);
    updateTag(`project-progress-${projectId}`);
    updateTag("dashboard");
};