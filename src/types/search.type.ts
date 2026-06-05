import { ProjectWithStats } from "./project.type";
import { TaskWithDetails } from "./task.type";
import { TeamMember } from "./user.type";

// ============ Search Result Items ============
export interface SearchProjectResult {
    id: string;
    name: string;
    description: string | null;
    status: string;
    deadline: string;
    stats: {
        totalTasks: number;
        completedTasks: number;
        memberCount: number;
        progress: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface SearchTaskResult {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: string;
    project: {
        id: string;
        name: string;
    };
    assignedTo: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    } | null;
    commentCount: number;
    attachmentCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface SearchMemberResult extends TeamMember {}

// ============ Search Results ============
export interface SearchResults {
    projects?: {
        items: SearchProjectResult[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
    tasks?: {
        items: SearchTaskResult[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
    members?: {
        items: SearchMemberResult[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
}

export interface GlobalSearchResponse {
    success: boolean;
    data: SearchResults;
}

// ============ Search Params ============
export interface GlobalSearchParams {
    q: string;
    type?: "all" | "projects" | "tasks" | "members";
    page?: number;
    limit?: number;
}

export interface SearchProjectsParams {
    q: string;
    status?: string;
    page?: number;
    limit?: number;
}

export interface SearchTasksParams {
    q: string;
    status?: string;
    priority?: string;
    projectId?: string;
    page?: number;
    limit?: number;
}

export interface SearchMembersParams {
    q: string;
    page?: number;
    limit?: number;
}

// ============ Search Suggestions ============
export interface SuggestionProject {
    id: string;
    name: string;
    status: string;
}

export interface SuggestionTask {
    id: string;
    title: string;
    status: string;
    priority: string;
}

export interface SuggestionMember {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
}

export interface SearchSuggestions {
    projects: SuggestionProject[];
    tasks: SuggestionTask[];
    members: SuggestionMember[];
}

export interface SearchSuggestionsResponse {
    success: boolean;
    data: SearchSuggestions;
}

// ============ Recent Searches ============
export interface RecentSearch {
    query: string;
    timestamp: string;
}

export interface RecentSearchesResponse {
    success: boolean;
    data: RecentSearch[];
}

// ============ Search State ============
export interface SearchFilters {
    type: "all" | "projects" | "tasks" | "members";
    status?: string;
    priority?: string;
    projectId?: string;
}

export interface SearchState {
    query: string;
    filters: SearchFilters;
    page: number;
    limit: number;
}