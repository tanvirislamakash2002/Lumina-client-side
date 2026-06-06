"use client";

import { useState } from "react";
import { AdminDashboardHeader } from "./AdminDashboardHeader";
import { AdminDashboardStats } from "./AdminDashboardStats";
import { AdminDashboardCharts } from "./AdminDashboardCharts";
import { AdminDashboardRecentUsers } from "./AdminDashboardRecentUsers";
import { AdminDashboardRecentProjects } from "./AdminDashboardRecentProjects";
import { AdminDashboardRecentActivities } from "./AdminDashboardRecentActivities";
import { AdminDashboardQuickActions } from "./AdminDashboardQuickActions";

interface AdminDashboardClientProps {
    dashboardData: any;
    statsData: any;
    recentUsers: any[];
    recentProjects: any[];
    recentActivities: any[];
}

export function AdminDashboardClient({
    dashboardData,
    statsData,
    recentUsers,
    recentProjects,
    recentActivities,
}: AdminDashboardClientProps) {
    const [dateRange, setDateRange] = useState("30d");

    const stats = dashboardData?.stats || {
        totalUsers: 0,
        activeUsers: 0,
        suspendedUsers: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
    };

    return (
        <div className="space-y-6">
            <AdminDashboardHeader />

            {/* Stats Cards */}
            <AdminDashboardStats stats={stats} />

            {/* Charts */}
            <AdminDashboardCharts statsData={statsData} dateRange={dateRange} onDateRangeChange={setDateRange} />

            {/* Recent Data Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                <AdminDashboardRecentUsers users={recentUsers} />
                <AdminDashboardRecentProjects projects={recentProjects} />
            </div>

            {/* Recent Activities and Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-2">
                <AdminDashboardRecentActivities activities={recentActivities} />
                <AdminDashboardQuickActions />
            </div>
        </div>
    );
}