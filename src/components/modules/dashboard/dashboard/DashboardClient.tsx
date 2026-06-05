"use client";

import { KPICards } from "./KPICards";
import { ProjectSummaries } from "./ProjectSummaries";
import { UpcomingDeadlines } from "./UpcomingDeadlines";
import { HighPriorityTasks } from "./HighPriorityTasks";
import { MemberWorkload } from "./MemberWorkload";
import { ChartsSection } from "./ChartsSection";
import { RecentActivities } from "./RecentActivities";

interface DashboardClientProps {
    initialData: any;
    userRole: string;
}

export function DashboardClient({ initialData, userRole }: DashboardClientProps) {
    const isProjectManager = userRole === "PROJECT_MANAGER";

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back! Here's an overview of your projects and tasks.
                </p>
            </div>

            {/* KPI Cards */}
            <KPICards data={initialData?.kpiCards} />

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Left Column - Project Summaries (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <ProjectSummaries data={initialData?.projectSummaries} />
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Upcoming Deadlines */}
                    <UpcomingDeadlines data={initialData?.upcomingDeadlines} />

                    {/* High Priority Tasks */}
                    <HighPriorityTasks data={initialData?.highPriorityTasks} />

                    {/* Member Workload (only for Project Managers) */}
                    {isProjectManager && (
                        <MemberWorkload data={initialData?.memberWorkload} />
                    )}
                </div>
            </div>

            {/* Charts Section */}
            <ChartsSection data={initialData?.charts} />

            {/* Recent Activities */}
            <RecentActivities data={initialData?.recentActivities} />
        </div>
    );
}