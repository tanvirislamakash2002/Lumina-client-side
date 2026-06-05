import { User } from "./user.type";
import { Project, ProjectStatus } from "./project.type";
import { Activity } from "./activity.type";

// ============ Admin Dashboard Stats ============
export interface AdminDashboardStats {
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
}

// ============ Recent Items ============
export interface RecentUser {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    accountStatus: string;
    createdAt: string;
}

export interface RecentProject {
    id: string;
    name: string;
    status: ProjectStatus;
    taskCount: number;
    memberCount: number;
    createdAt: string;
}

export interface RecentActivity extends Activity {}

// ============ Admin Dashboard Response ============
export interface AdminDashboardResponse {
    stats: AdminDashboardStats;
    recentActivities: RecentActivity[];
    recentUsers: RecentUser[];
    recentProjects: RecentProject[];
}

// ============ System Stats ============
export interface DailyActiveUser {
    date: string;
    count: number;
}

export interface SystemStatsResponse {
    totalUsers: number;
    userGrowthLastMonth: number;
    totalProjects: number;
    projectGrowthLastMonth: number;
    totalTasks: number;
    taskGrowthLastMonth: number;
    activeUsersLast30Days: number;
    dailyActiveUsers: DailyActiveUser[];
}

// ============ User Management ============
export interface AdminUser extends User {
    _count: {
        assignedTasks: number;
        projectMembers: number;
        activities: number;
    };
}

export interface AdminUserStats {
    total: number;
    admin: number;
    projectManager: number;
    teamMember: number;
    active: number;
    suspended: number;
}

export interface AdminUsersResponse {
    users: AdminUser[];
    stats: AdminUserStats;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface AdminUserDetails extends AdminUser {
    projects: Project[];
    recentActivities: {
        action: string;
        message: string;
        createdAt: string;
        projectName: string | null;
        taskTitle: string | null;
    }[];
}

export interface AdminUserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
}

// ============ Admin Project Management ============
export interface AdminProject extends Project {
    stats: {
        totalTasks: number;
        completedTasks: number;
        memberCount: number;
        progress: number;
    };
}

export interface AdminProjectStats {
    total: number;
    active: number;
    completed: number;
    onHold: number;
}

export interface AdminProjectsResponse {
    projects: AdminProject[];
    stats: AdminProjectStats;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface AdminProjectFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

// ============ Bulk Actions ============
export interface BulkUserActionData {
    action: "suspend" | "activate" | "delete";
    userIds: string[];
}

export interface BulkUserActionResponse {
    success: boolean;
    message: string;
}

// ============ System Logs ============
export interface SystemLog {
    id: string;
    level: "INFO" | "WARN" | "ERROR";
    action: string;
    message: string;
    userId: string;
    userName: string;
    userEmail: string;
    createdAt: string;
}

export interface SystemLogsResponse {
    logs: SystemLog[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface SystemLogFilters {
    page?: number;
    limit?: number;
    level?: string;
    days?: number;
}

// ============ Audit Trail ============
export interface AuditActivity extends Activity {}

export interface AuditTrailResponse {
    activities: AuditActivity[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface AuditTrailFilters {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    days?: number;
}

// ============ Admin Actions ============
export interface UpdateUserRoleData {
    role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
}

export interface AdminActionResponse {
    success: boolean;
    message: string;
}