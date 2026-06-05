"use server";

import { dashboardService } from "@/services/dashboard.service";
import { updateTag } from "next/cache";

// Get complete dashboard data (all sections)
export const getDashboard = async () => {
    return await dashboardService.getDashboard();
};

// Get KPI cards only
export const getKPICards = async () => {
    return await dashboardService.getKPICards();
};

// Get project summaries with progress
export const getProjectSummaries = async (limit: number = 5) => {
    return await dashboardService.getProjectSummaries(limit);
};

// Get upcoming deadlines
export const getUpcomingDeadlines = async (limit: number = 10) => {
    return await dashboardService.getUpcomingDeadlines(limit);
};

// Get high priority tasks
export const getHighPriorityTasks = async (limit: number = 5) => {
    return await dashboardService.getHighPriorityTasks(limit);
};

// Get member workload summary
export const getMemberWorkload = async (projectId?: string, limit: number = 10) => {
    return await dashboardService.getMemberWorkload(projectId, limit);
};

// Get charts data (tasks by priority, status, trends)
export const getCharts = async (days: number = 30) => {
    return await dashboardService.getCharts(days);
};

// Get recent activities (for dashboard feed)
export const getRecentActivities = async (limit: number = 10) => {
    return await dashboardService.getRecentActivities(limit);
};

// Revalidate all dashboard data
export const revalidateDashboard = async () => {
    updateTag("dashboard");
    updateTag("dashboard-kpi");
    updateTag("dashboard-projects");
    updateTag("dashboard-deadlines");
    updateTag("dashboard-high-priority");
    updateTag("dashboard-workload");
    updateTag("dashboard-charts");
    updateTag("dashboard-activities");
};

// Revalidate specific dashboard sections
export const revalidateKPICards = async () => {
    updateTag("dashboard-kpi");
};

export const revalidateProjectSummaries = async () => {
    updateTag("dashboard-projects");
};

export const revalidateUpcomingDeadlines = async () => {
    updateTag("dashboard-deadlines");
};

export const revalidateHighPriorityTasks = async () => {
    updateTag("dashboard-high-priority");
};

export const revalidateMemberWorkload = async () => {
    updateTag("dashboard-workload");
};

export const revalidateCharts = async () => {
    updateTag("dashboard-charts");
};

export const revalidateRecentActivities = async () => {
    updateTag("dashboard-activities");
};