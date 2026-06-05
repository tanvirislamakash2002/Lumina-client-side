"use server";

import { filterService } from "@/services/filter.service";
import { updateTag } from "next/cache";

// Get all filter options
export const getFilterOptions = async () => {
    return await filterService.getFilterOptions();
};

// Get task-specific filter options
export const getTaskFilters = async (projectId?: string) => {
    return await filterService.getTaskFilters(projectId);
};

// Get project-specific filter options
export const getProjectFilters = async () => {
    return await filterService.getProjectFilters();
};

// Get member-specific filter options
export const getMemberFilters = async (projectId?: string) => {
    return await filterService.getMemberFilters(projectId);
};

// Get saved filters for current user
export const getSavedFilters = async (type?: string) => {
    return await filterService.getSavedFilters(type);
};

// Save a filter
export const saveFilter = async (name: string, type: "task" | "project" | "member", filters: Record<string, any>) => {
    // Validate name
    if (!name || name.trim().length < 3) {
        return {
            success: false,
            message: "Filter name must be at least 3 characters",
        };
    }

    // Validate type
    if (!["task", "project", "member"].includes(type)) {
        return {
            success: false,
            message: "Invalid filter type",
        };
    }

    // Validate filters
    if (!filters || typeof filters !== "object") {
        return {
            success: false,
            message: "Filters object is required",
        };
    }

    const result = await filterService.saveFilter(name.trim(), type, filters);
    if (result.success) {
        updateTag("saved-filters");
    }
    return result;
};

// Update a saved filter
export const updateSavedFilter = async (filterId: string, data: { name?: string; filters?: Record<string, any> }) => {
    if (!filterId) {
        return {
            success: false,
            message: "Filter ID is required",
        };
    }

    const result = await filterService.updateSavedFilter(filterId, data);
    if (result.success) {
        updateTag("saved-filters");
    }
    return result;
};

// Delete a saved filter
export const deleteSavedFilter = async (filterId: string) => {
    if (!filterId) {
        return {
            success: false,
            message: "Filter ID is required",
        };
    }

    const result = await filterService.deleteSavedFilter(filterId);
    if (result.success) {
        updateTag("saved-filters");
    }
    return result;
};

// Revalidate filter data
export const revalidateFilters = async () => {
    updateTag("filter-options");
    updateTag("task-filters");
    updateTag("project-filters");
    updateTag("member-filters");
    updateTag("saved-filters");
};

export const revalidateTaskFilters = async (projectId?: string) => {
    updateTag("task-filters");
    if (projectId) updateTag(`task-filters-${projectId}`);
};

export const revalidateMemberFilters = async (projectId?: string) => {
    updateTag("member-filters");
    if (projectId) updateTag(`member-filters-${projectId}`);
};

export const revalidateSavedFilters = async () => {
    updateTag("saved-filters");
};