import { User } from "./user.type";

export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface Task {
    id: string;
    title: string;
    description: string | null;
    dueDate: string;
    priority: TaskPriority;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}

export interface TaskWithDetails extends Task {
    assignedTo: User | null;
    project: {
        id: string;
        name: string;
    };
    commentCount: number;
    attachmentCount: number;
}

export interface TaskDetails extends TaskWithDetails {
    comments: Comment[];
    attachments: Attachment[];
}

export interface TaskStats {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    overdue: number;
}

export interface TaskFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    sortBy?: "latest" | "oldest" | "deadline_asc" | "deadline_desc" | "priority_high" | "title_asc";
}

export interface TasksResponse {
    tasks: TaskWithDetails[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    stats: TaskStats;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    assignedTo?: string | null;
    dueDate?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
}

export interface MyTasksResponse {
    tasks: TaskWithDetails[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    stats: TaskStats;
}

export interface MyTasksFilters {
    page?: number;
    limit?: number;
    status?: string;
    projectId?: string;
}

export interface OverdueTask {
    id: string;
    title: string;
    dueDate: string;
    priority: TaskPriority;
    status: TaskStatus;
    project: {
        id: string;
        name: string;
    };
    assignedTo: User | null;
}

// Re-export Comment and Attachment types (to be defined in their respective type files)
export interface Comment {
    id: string;
    content: string;
    isEdited: boolean;
    createdAt: string;
    updatedAt: string;
    user: User;
    replies: Comment[];
    replyCount: number;
    parentId: string | null;
}

export interface Attachment {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedBy: User;
    createdAt: string;
}

export interface TaskSummary {
    id: string;
    title: string;
    description: string | null;
    dueDate: string;
    priority: TaskPriority;
    status: TaskStatus;
    assignedTo: User | null;
    createdAt: string;
}