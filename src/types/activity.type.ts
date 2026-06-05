import { User } from "./user.type";
import { Project } from "./project.type";
import { Task } from "./task.type";

export type ActivityAction =
    | "PROJECT_CREATED"
    | "PROJECT_UPDATED"
    | "PROJECT_DELETED"
    | "TASK_CREATED"
    | "TASK_UPDATED"
    | "TASK_DELETED"
    | "TASK_ASSIGNED"
    | "TASK_STATUS_CHANGED"
    | "MEMBER_ADDED"
    | "MEMBER_REMOVED"
    | "COMMENT_ADDED"
    | "COMMENT_DELETED"
    | "ATTACHMENT_ADDED"
    | "USER_LOGIN"
    | "USER_LOGOUT"
    | "USER_REGISTER"
    | "ADMIN_ACTION";

export interface Activity {
    id: string;
    action: ActivityAction;
    message: string;
    details: any;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
    project: {
        id: string;
        name: string;
    } | null;
    task: {
        id: string;
        title: string;
    } | null;
}

export interface ActivityFilters {
    page?: number;
    limit?: number;
    projectId?: string;
    taskId?: string;
    action?: string;
}

export interface ActivitiesResponse {
    activities: Activity[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    actionCounts: {
        action: string;
        count: number;
    }[];
}

export interface ProjectActivitiesResponse {
    activities: Omit<Activity, "project">[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface TaskActivitiesResponse {
    activities: Omit<Activity, "task">[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface UserActivity {
    id: string;
    action: ActivityAction;
    message: string;
    details: any;
    createdAt: string;
    project: {
        id: string;
        name: string;
    } | null;
    task: {
        id: string;
        title: string;
    } | null;
}

export interface UserActivitiesResponse {
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
    activities: UserActivity[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    summary: {
        totalActivities: number;
        topActions: {
            action: string;
            count: number;
        }[];
    };
}

export interface DailyActivity {
    date: string;
    count: number;
}

export interface ActionStat {
    action: string;
    count: number;
}

export interface ActiveUser {
    userId: string;
    name: string;
    email: string;
    image: string | null;
    activityCount: number;
}

export interface ActivityStats {
    totalActivities: number;
    uniqueUsersCount: number;
    topProject: string | null;
    dailyActivities: DailyActivity[];
    actionStats: ActionStat[];
    activeUsers: ActiveUser[];
    period: {
        startDate: string;
        endDate: string;
        days: number;
    };
}

export interface GetActivityStatsParams {
    days?: number;
}