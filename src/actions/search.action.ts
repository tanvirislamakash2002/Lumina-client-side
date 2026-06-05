"use server";

import { searchService } from "@/services/search.service";
import { updateTag } from "next/cache";

// Global search across all entities
export const globalSearch = async (
    query: string,
    type?: string,
    params?: {
        page?: number;
        limit?: number;
    }
) => {
    // Validate query
    if (!query || query.trim().length < 2) {
        return {
            success: false,
            message: "Search query must be at least 2 characters",
        };
    }
    return await searchService.globalSearch(query.trim(), type, params);
};

// Search projects only
export const searchProjects = async (
    query: string,
    params?: {
        status?: string;
        page?: number;
        limit?: number;
    }
) => {
    if (!query || query.trim().length < 2) {
        return {
            success: false,
            message: "Search query must be at least 2 characters",
        };
    }
    return await searchService.searchProjects(query.trim(), params);
};

// Search tasks only
export const searchTasks = async (
    query: string,
    params?: {
        status?: string;
        priority?: string;
        projectId?: string;
        page?: number;
        limit?: number;
    }
) => {
    if (!query || query.trim().length < 2) {
        return {
            success: false,
            message: "Search query must be at least 2 characters",
        };
    }
    return await searchService.searchTasks(query.trim(), params);
};

// Search members only
export const searchMembers = async (
    query: string,
    params?: {
        page?: number;
        limit?: number;
    }
) => {
    if (!query || query.trim().length < 2) {
        return {
            success: false,
            message: "Search query must be at least 2 characters",
        };
    }
    return await searchService.searchMembers(query.trim(), params);
};

// Get search suggestions (autocomplete)
export const getSearchSuggestions = async (query: string) => {
    if (!query || query.trim().length < 2) {
        return {
            success: false,
            message: "Query must be at least 2 characters",
        };
    }
    return await searchService.getSearchSuggestions(query.trim());
};

// Get recent searches
export const getRecentSearches = async (limit: number = 10) => {
    return await searchService.getRecentSearches(limit);
};

// Clear recent searches
export const clearRecentSearches = async () => {
    const result = await searchService.clearRecentSearches();
    if (result.success) {
        updateTag("recent-searches");
    }
    return result;
};

// Revalidate search data
export const revalidateSearch = async () => {
    updateTag("global-search");
    updateTag("search-projects");
    updateTag("search-tasks");
    updateTag("search-members");
    updateTag("search-suggestions");
    updateTag("recent-searches");
};