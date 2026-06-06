"use client";

import { MemberDashboardHeader } from "./MemberDashboardHeader";
import { MemberDashboardStats } from "./MemberDashboardStats";
import { MemberMyTasks } from "./MemberMyTasks";
import { MemberProjectSummaries } from "./MemberProjectSummaries";
import { MemberUpcomingDeadlines } from "./MemberUpcomingDeadlines";
import { MemberRecentActivities } from "./MemberRecentActivities";

interface MemberDashboardClientProps {
    projects: any[];
    tasks: any[];
    activities: any[];
}

export function MemberDashboardClient({
    projects,
    tasks,
    activities,
}: MemberDashboardClientProps) {
    // Calculate stats (member-specific)
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED").length;
    const overdueTasks = tasks.filter(
        (t) => t.status !== "COMPLETED" && new Date(t.dueDate) < new Date()
    ).length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Get upcoming deadlines (tasks due in next 7 days, not completed)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingTasks = tasks
        .filter((t) => t.status !== "COMPLETED" && new Date(t.dueDate) <= nextWeek)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

    // Get tasks by status for sections
    const todoTasks = tasks.filter((t) => t.status === "TODO").slice(0, 3);
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").slice(0, 3);
    const recentCompletedTasks = tasks
        .filter((t) => t.status === "COMPLETED")
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);

    const stats = {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        completionRate,
    };

    return (
        <div className="space-y-6">
            <MemberDashboardHeader />

            {/* Stats Cards */}
            <MemberDashboardStats stats={stats} />

            {/* Main Content - Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Left Column (4 cols) - My Tasks Section */}
                <div className="lg:col-span-4 space-y-6">
                    <MemberMyTasks
                        todoTasks={todoTasks}
                        inProgressTasks={inProgressTasks}
                        recentCompletedTasks={recentCompletedTasks}
                    />
                </div>

                {/* Right Column (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <MemberProjectSummaries projects={projects} />
                    <MemberUpcomingDeadlines tasks={upcomingTasks} />
                </div>
            </div>

            {/* Recent Activities - Full Width */}
            <MemberRecentActivities activities={activities} />
        </div>
    );
}