import { User } from "./user.type";

export interface Comment {
    id: string;
    content: string;
    isEdited: boolean;
    createdAt: string;
    updatedAt: string;
    user: User;
    parentId: string | null;
}

export interface CommentWithReplies extends Comment {
    replies: CommentWithReplies[];
    replyCount: number;
}

export interface TaskComment extends CommentWithReplies {
    taskId: string;
    taskTitle?: string;
}

export interface UserComment {
    id: string;
    content: string;
    isEdited: boolean;
    createdAt: string;
    updatedAt: string;
    task: {
        id: string;
        title: string;
        projectId: string;
        project: {
            id: string;
            name: string;
        };
    };
    replyCount: number;
}

export interface CommentsResponse {
    comments: CommentWithReplies[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface UserCommentsResponse {
    comments: UserComment[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    stats: {
        total: number;
    };
}

export interface CreateCommentData {
    content: string;
    parentId?: string | null;
}

export interface UpdateCommentData {
    content: string;
}

export interface GetCommentsParams {
    page?: number;
    limit?: number;
}

export interface GetUserCommentsParams {
    page?: number;
    limit?: number;
}