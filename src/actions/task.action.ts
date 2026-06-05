"use server";

import { taskService } from "@/services/task.service";
import { updateTag } from "next/cache";

// Create a new task
export const createTask = async (
    projectId: string,
    data: {
        title: string;
        description?: string;
        assignedTo?: string;
        dueDate?: string;
        priority?: string;
        status?: string;
    }
) => {
    // Validate title
    if (!data.title || data.title.trim().length < 3) {
        return {
            success: false,
            message: "Task title must be at least 3 characters",
        };
    }

    // Validate due date
    if (data.dueDate && new Date(data.dueDate) < new Date()) {
        return {
            success: false,
            message: "Due date cannot be in the past",
        };
    }

    const result = await taskService.createTask(projectId, data);
    if (result.success) {
        updateTag(`project-tasks-${projectId}`);
        updateTag(`project-${projectId}`);
        updateTag(`project-stats-${projectId}`);
        updateTag(`project-progress-${projectId}`);
        updateTag("my-tasks");
        updateTag("dashboard");
    }
    return result;
};

// Get all tasks (across all accessible projects)
export const getAllTasks = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    projectId?: string;
    assignedTo?: string;
    sortBy?: string;
}) => {
    return await taskService.getAllTasks(params);
};

// Get tasks for a project
export const getTasks = async (
    projectId: string,
    params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        priority?: string;
        assignedTo?: string;
        sortBy?: string;
    }
) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }
    return await taskService.getTasks(projectId, params);
};

// Get task by ID
export const getTaskById = async (taskId: string) => {
    if (!taskId) {
        return {
            success: false,
            message: "Task ID is required",
        };
    }
    return await taskService.getTaskById(taskId);
};

// Update task
export const updateTask = async (
    taskId: string,
    data: {
        title?: string;
        description?: string;
        assignedTo?: string | null;
        dueDate?: string;
        priority?: string;
        status?: string;
    }
) => {
    // Validate due date if provided
    if (data.dueDate && new Date(data.dueDate) < new Date()) {
        return {
            success: false,
            message: "Due date cannot be in the past",
        };
    }

    const result = await taskService.updateTask(taskId, data);
    if (result.success && result.data) {
        updateTag(`task-${taskId}`);
        updateTag(`project-tasks-${result.data.projectId}`);
        updateTag(`project-${result.data.projectId}`);
        updateTag(`project-stats-${result.data.projectId}`);
        updateTag(`project-progress-${result.data.projectId}`);
        updateTag("my-tasks");
        updateTag("dashboard");
    }
    return result;
};

// Delete task
export const deleteTask = async (taskId: string, projectId: string) => {
    const result = await taskService.deleteTask(taskId);
    if (result.success) {
        updateTag(`project-tasks-${projectId}`);
        updateTag(`project-${projectId}`);
        updateTag(`project-stats-${projectId}`);
        updateTag(`project-progress-${projectId}`);
        updateTag("my-tasks");
        updateTag("dashboard");
    }
    return result;
};

// Update task status (quick action)
export const updateTaskStatus = async (taskId: string, status: string, projectId: string) => {
    // Validate status
    const validStatuses = ["TODO", "IN_PROGRESS", "COMPLETED"];
    if (!validStatuses.includes(status)) {
        return {
            success: false,
            message: "Invalid status. Must be TODO, IN_PROGRESS, or COMPLETED",
        };
    }

    const result = await taskService.updateTaskStatus(taskId, status);
    if (result.success) {
        updateTag(`task-${taskId}`);
        updateTag(`project-tasks-${projectId}`);
        updateTag(`project-${projectId}`);
        updateTag(`project-stats-${projectId}`);
        updateTag(`project-progress-${projectId}`);
        updateTag("my-tasks");
        updateTag("dashboard");
    }
    return result;
};

// Get tasks assigned to current user
export const getMyTasks = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    projectId?: string;
}) => {
    return await taskService.getMyTasks(params);
};

// Get overdue tasks
export const getOverdueTasks = async () => {
    return await taskService.getOverdueTasks();
};

// Revalidate task data
export const revalidateTask = async (taskId: string, projectId: string) => {
    updateTag(`task-${taskId}`);
    updateTag(`project-tasks-${projectId}`);
    updateTag(`project-${projectId}`);
    updateTag(`project-stats-${projectId}`);
    updateTag(`project-progress-${projectId}`);
    updateTag("my-tasks");
    updateTag("dashboard");
};