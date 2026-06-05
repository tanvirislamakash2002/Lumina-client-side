import { TaskSummary } from "./task.type";
import { User } from "./user.type";

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD";

export interface Project {
    id: string;
    name: string;
    description: string | null;
    deadline: string;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectWithStats extends Project {
    stats: {
        totalTasks: number;
        completedTasks: number;
        memberCount: number;
        progress: number;
    };
}

export interface ProjectDetails extends ProjectWithStats {
    progress: number;
    members: User[];
    tasks: TaskSummary[];
}

export interface ProjectStats {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
    memberCount: number;
}

export interface ProjectFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: "latest" | "oldest" | "deadline_asc" | "deadline_desc" | "name_asc";
}

export interface ProjectsResponse {
    projects: ProjectWithStats[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    stats: {
        total: number;
        active: number;
        completed: number;
        onHold: number;
    };
}

export interface CreateProjectData {
    name: string;
    description?: string;
    deadline?: string;
    status?: ProjectStatus;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    deadline?: string;
    status?: ProjectStatus;
}

export interface ProjectProgress {
    progress: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    chartData: {
        date: string;
        count: number;
    }[];
}

export interface ProjectMemberWorkload {
    userId: string;
    name: string;
    image: string | null;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    completionRate: number;
}