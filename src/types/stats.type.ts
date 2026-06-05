import { User } from "./user.type";
import { ProjectStatus } from "./project.type";
import { TaskPriority, TaskStatus } from "./task.type";

// ============ Platform Stats ============
export interface TasksByPriority {
    priority: TaskPriority;
    count: number;
}

export interface TasksByStatus {
    status: TaskStatus;
    count: number;
}

export interface PlatformStats {
    totalUsers: number;
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    activeProjects: number;
    completedProjects: number;
    newUsersThisWeek: number;
    tasksByPriority: TasksByPriority[];
    tasksByStatus: TasksByStatus[];
}

// ============ User Stats ============
export interface UserStatsData {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
    projectsCount: number;
    commentsCount: number;
}

export interface UserTasksByPriority {
    priority: TaskPriority;
    count: number;
}

export interface UserRecentActivity {
    action: string;
    message: string;
    createdAt: string;
    projectName: string | null;
    taskTitle: string | null;
}

export interface UserStatsResponse {
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        role: string;
        createdAt: string;
    };
    stats: UserStatsData;
    tasksByPriority: UserTasksByPriority[];
    recentActivity: UserRecentActivity[];
    memberSince: string;
}

// ============ Project Stats ============
export interface ProjectTasksByPriority {
    priority: TaskPriority;
    count: number;
}

export interface ProjectMemberWorkloadStats {
    user: {
        id: string;
        name: string;
        image: string | null;
    };
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
}

export interface ProjectStatsData {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
    memberCount: number;
}

export interface ProjectStatsResponse {
    id: string;
    name: string;
    status: ProjectStatus;
    deadline: string;
    daysUntilDeadline: number;
    isOverdue: boolean;
    stats: ProjectStatsData;
    tasksByPriority: ProjectTasksByPriority[];
    memberWorkload: ProjectMemberWorkloadStats[];
}

// ============ Task Stats ============
export interface TaskComment {
    id: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
}

export interface TaskAttachment {
    id: string;
    filename: string;
    size: number;
    createdAt: string;
    uploader: {
        id: string;
        name: string;
        image: string | null;
    };
}

export interface TaskActivity {
    id: string;
    action: string;
    message: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
}

export interface TaskStatsData {
    commentCount: number;
    attachmentCount: number;
    activityCount: number;
}

export interface TaskStatsResponse {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    daysUntilDue: number;
    isOverdue: boolean;
    assignedTo: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    } | null;
    project: {
        id: string;
        name: string;
    };
    stats: TaskStatsData;
    recentComments: TaskComment[];
    recentAttachments: TaskAttachment[];
    recentActivity: TaskActivity[];
    createdAt: string;
    updatedAt: string;
}

// ============ Team Stats ============
export interface TeamOverview {
    totalMembers: number;
    activeMembers: number;
    adminCount: number;
    projectManagerCount: number;
    teamMemberCount: number;
    totalTasksAssigned: number;
    completedTasks: number;
    overallCompletionRate: number;
}

export interface TopPerformer {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    completedTasks: number;
    completionRate: number;
}

export interface WorkloadDistribution {
    userId: string;
    name: string;
    role: string;
    taskCount: number;
}

export interface TeamStatsResponse {
    overview: TeamOverview;
    topPerformers: TopPerformer[];
    workloadDistribution: WorkloadDistribution[];
}

// ============ Activity Stats ============
export interface ActivityDailyStat {
    date: string;
    count: number;
}

export interface ActivityActionStat {
    action: string;
    count: number;
}

export interface ActivityActiveUser {
    userId: string;
    name: string;
    email: string;
    image: string | null;
    activityCount: number;
}

export interface ActivityStatsPeriod {
    startDate: string;
    endDate: string;
    days: number;
}

export interface ActivityStatsResponse {
    dailyActivities: ActivityDailyStat[];
    actionsCount: ActivityActionStat[];
    activeUsers: ActivityActiveUser[];
    period: ActivityStatsPeriod;
}

// ============ Completion Stats ============
export interface CompletionByPriority {
    priority: TaskPriority;
    total: number;
    completed: number;
    rate: number;
}

export interface MonthlyCompletion {
    month: string;
    total: number;
    completed: number;
    rate: number;
}

export interface CompletionStatsResponse {
    completionByPriority: CompletionByPriority[];
    monthlyCompletion: MonthlyCompletion[];
    avgCompletionDays: number;
    totalCompletedTasks: number;
}

// ============ Stats Params ============
export interface GetActivityStatsParams {
    days?: number;
}

export interface GetUserStatsParams {
    userId?: string;
}

export interface GetProjectStatsParams {
    projectId: string;
}

export interface GetTaskStatsParams {
    taskId: string;
}