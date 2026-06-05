export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
    accountStatus: "ACTIVE" | "SUSPENDED";
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile extends User {
    phone?: string | null;
    address?: string | null;
}

export interface UserStats {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
    projectsCount: number;
    commentsCount: number;
}

export interface UserWorkload {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
    completionRate: number;
}

export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
}

export interface UsersResponse {
    users: User[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    stats: {
        total: number;
        admin: number;
        projectManager: number;
        teamMember: number;
        active: number;
        suspended: number;
    };
}

export interface UpdateProfileData {
    name?: string;
    image?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
}