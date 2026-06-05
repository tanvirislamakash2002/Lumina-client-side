import { ProjectStatus } from "./project.type";
import { TaskPriority, TaskStatus } from "./task.type";
import { TeamMember } from "./user.type";

// ============ Filter Option Types ============
export interface FilterOption<T = string> {
    value: T;
    label: string;
    count?: number;
}

export interface FilterOptionWithId extends FilterOption {
    id: string;
}

export interface ProjectStatusFilter extends FilterOption<ProjectStatus> {}

export interface TaskStatusFilter extends FilterOption<TaskStatus> {}

export interface TaskPriorityFilter extends FilterOption<TaskPriority> {}

export interface DeadlineFilterOption extends FilterOption {
    value: "overdue" | "today" | "tomorrow" | "thisWeek" | "nextWeek" | "thisMonth" | "noDeadline";
}

export interface WorkloadFilterOption extends FilterOption {
    value: "low" | "medium" | "high";
    min: number;
    max: number;
}

// ============ Filter Options Responses ============
export interface FilterOptionsResponse {
    projectStatuses: ProjectStatusFilter[];
    taskStatuses: TaskStatusFilter[];
    priorities: TaskPriorityFilter[];
    activeProjects: FilterOptionWithId[];
    teamMembers: TeamMember[];
}

export interface TaskFiltersResponse {
    statuses: TaskStatusFilter[];
    priorities: TaskPriorityFilter[];
    assignees: TeamMember[];
    projects: FilterOptionWithId[];
    deadlineOptions: DeadlineFilterOption[];
}

export interface ProjectFiltersResponse {
    statuses: ProjectStatusFilter[];
    projectManagers: TeamMember[];
    dateRangeOptions: FilterOption[];
}

export interface MemberFiltersResponse {
    members: TeamMember[];
    roles: FilterOption[];
    workloadOptions: WorkloadFilterOption[];
}

// ============ Saved Filter Types ============
export type SavedFilterType = "task" | "project" | "member";

export interface SavedFilter {
    id: string;
    userId: string;
    name: string;
    type: SavedFilterType;
    filters: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface SavedFiltersResponse {
    success: boolean;
    data: SavedFilter[];
}

export interface SaveFilterData {
    name: string;
    type: SavedFilterType;
    filters: Record<string, any>;
}

export interface UpdateFilterData {
    name?: string;
    filters?: Record<string, any>;
}

export interface SaveFilterResponse {
    success: boolean;
    data: SavedFilter;
    message?: string;
}

// ============ Filter State Types ============
export interface TaskFilterState {
    status?: TaskStatus | "all";
    priority?: TaskPriority | "all";
    assignedTo?: string | "all" | "me";
    projectId?: string;
    deadline?: DeadlineFilterOption["value"] | "all";
    search?: string;
}

export interface ProjectFilterState {
    status?: ProjectStatus | "all";
    projectManager?: string;
    dateRange?: string;
    search?: string;
}

export interface MemberFilterState {
    role?: string | "all";
    workload?: WorkloadFilterOption["value"] | "all";
    search?: string;
}

export interface FilterPreset {
    id: string;
    name: string;
    filters: TaskFilterState | ProjectFilterState | MemberFilterState;
}

// ============ Active Filters Display ============
export interface ActiveFilter {
    key: string;
    label: string;
    value: string;
    onRemove: () => void;
}