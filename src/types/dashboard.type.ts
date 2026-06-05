import { User } from "./user.type";
import { Project, ProjectStatus } from "./project.type";
import { TaskPriority, TaskStatus } from "./task.type";
import { Activity } from "./activity.type";

// ============ KPI Cards ============
export interface KPICards {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    completionRate: number;
}

// ============ Project Summary ============
export interface ProjectSummary {
    id: string;
    name: string;
    status: ProjectStatus;
    deadline: string;
    daysUntilDeadline: number;
    totalTasks: number;
    completedTasks: number;
    progress: number;
    isOverdue: boolean;
}

// ============ Upcoming Deadline ============
export interface UpcomingDeadline {
    id: string;
    title: string;
    dueDate: string;
    daysUntil: number;
    priority: TaskPriority;
    project: {
        id: string;
        name: string;
    };
    assignedTo: {
        id: string;
        name: string;
        image: string | null;
    } | null;
}

// ============ High Priority Task ============
export interface HighPriorityTask {
    id: string;
    title: string;
    dueDate: string;
    status: TaskStatus;
    project: {
        id: string;
        name: string;
    };
    assignedTo: {
        id: string;
        name: string;
        image: string | null;
    } | null;
}

// ============ Member Workload ============
export interface MemberWorkload {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
}

// ============ Charts Data ============
export interface TasksByPriority {
    priority: TaskPriority;
    count: number;
}

export interface TasksByStatus {
    status: TaskStatus;
    count: number;
}

export interface TasksOverTime {
    date: string;
    count: number;
}

export interface ProjectProgressData {
    name: string;
    totalTasks: number;
    completedTasks: number;
    progress: number;
}

export interface ChartsData {
    tasksByPriority: TasksByPriority[];
    tasksByStatus: TasksByStatus[];
    tasksOverTime: TasksOverTime[];
    projectProgress: ProjectProgressData[];
}

// ============ Dashboard Data ============
export interface DashboardData {
    kpiCards: KPICards;
    projectSummaries: ProjectSummary[];
    upcomingDeadlines: UpcomingDeadline[];
    highPriorityTasks: HighPriorityTask[];
    memberWorkload: MemberWorkload[];
    charts: ChartsData;
    recentActivities: Activity[];
}

// ============ Individual Section Responses ============
export interface KPICardsResponse {
    success: boolean;
    data: KPICards;
}

export interface ProjectSummariesResponse {
    success: boolean;
    data: ProjectSummary[];
}

export interface UpcomingDeadlinesResponse {
    success: boolean;
    data: UpcomingDeadline[];
}

export interface HighPriorityTasksResponse {
    success: boolean;
    data: HighPriorityTask[];
}

export interface MemberWorkloadResponse {
    success: boolean;
    data: MemberWorkload[];
}

export interface ChartsDataResponse {
    success: boolean;
    data: ChartsData;
}

export interface RecentActivitiesResponse {
    success: boolean;
    data: Activity[];
}

// ============ Dashboard Filters ============
export interface DashboardFilters {
    projectId?: string;
    days?: number;
    limit?: number;
}