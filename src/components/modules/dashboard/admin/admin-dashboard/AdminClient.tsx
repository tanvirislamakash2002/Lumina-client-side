"use client";

import { useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminStats } from "./AdminStats";
import { AdminCharts } from "./AdminCharts";
import { RecentUsersTable } from "./RecentUsersTable";
import { RecentProjectsTable } from "./RecentProjectsTable";
import { RecentActivitiesFeed } from "./RecentActivitiesFeed";
import { QuickActions } from "./QuickActions";

interface AdminClientProps {
    dashboardData: any;
    statsData: any;
    recentUsers: any[];
    recentProjects: any[];
    recentActivities: any[];
}

export function AdminClient({
    dashboardData,
    statsData,
    recentUsers,
    recentProjects,
    recentActivities,
}: AdminClientProps) {
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
            <AdminHeader />

            {/* Stats Cards */}
            <AdminStats stats={stats} />

            {/* Charts */}
            <AdminCharts statsData={statsData} dateRange={dateRange} onDateRangeChange={setDateRange} />

            {/* Recent Data Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                <RecentUsersTable users={recentUsers} />
                <RecentProjectsTable projects={recentProjects} />
            </div>

            {/* Recent Activities and Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-2">
                <RecentActivitiesFeed activities={recentActivities} />
                <QuickActions />
            </div>
        </div>
    );
}