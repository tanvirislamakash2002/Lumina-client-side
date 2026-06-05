import { User, TeamMember } from "./user.type";
import { ProjectWithStats } from "./project.type";

export interface ProjectMember {
    id: string;
    userId: string;
    projectId: string;
    joinedAt: string;
    user: User;
}

export interface ProjectMemberWithTasks extends ProjectMember {
    taskCount: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
}

export interface ProjectMembersResponse {
    members: ProjectMemberWithTasks[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface AddMemberData {
    memberId: string;
}

export interface MembershipCheck {
    isMember: boolean;
}

export interface UserProject extends ProjectWithStats {
    joinedAt: string;
}

export interface UserProjectsResponse {
    projects: UserProject[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface AvailableMember extends TeamMember {
    role: string;
}

export interface GetProjectMembersParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface GetUserProjectsParams {
    page?: number;
    limit?: number;
}