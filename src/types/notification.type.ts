export type NotificationType =
    | "TASK_ASSIGNED"
    | "TASK_STATUS_CHANGED"
    | "TASK_DUE_SOON"
    | "TASK_OVERDUE"
    | "COMMENT_ADDED"
    | "MENTIONED"
    | "PROJECT_INVITE";

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    isRead: boolean;
    metadata: {
        taskId?: string;
        projectId?: string;
        commentId?: string;
        assignedBy?: string;
        dueDate?: string;
    };
    createdAt: string;
    readAt: string | null;
}

export interface NotificationFilters {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
}

export interface NotificationsResponse {
    notifications: Notification[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    typeCounts: {
        type: string;
        count: number;
    }[];
    unreadCount: number;
}

export interface UnreadCountResponse {
    unreadCount: number;
}

export interface NotificationSettings {
    taskAssigned: boolean;
    taskStatusChanged: boolean;
    taskDueSoon: boolean;
    taskOverdue: boolean;
    commentAdded: boolean;
    mentioned: boolean;
    projectInvite: boolean;
}

export interface UpdateNotificationSettingsData {
    taskAssigned?: boolean;
    taskStatusChanged?: boolean;
    taskDueSoon?: boolean;
    taskOverdue?: boolean;
    commentAdded?: boolean;
    mentioned?: boolean;
    projectInvite?: boolean;
}

export interface MarkAsReadResponse {
    success: boolean;
    message: string;
}

export interface DeleteNotificationResponse {
    success: boolean;
    message: string;
}