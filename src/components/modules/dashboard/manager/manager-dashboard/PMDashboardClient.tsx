"use client";

import { PMDashboardHeader } from "./PMDashboardHeader";
import { PMDashboardStats } from "./PMDashboardStats";
import { PMProjectSummaries } from "./PMProjectSummaries";
import { PMUpcomingDeadlines } from "./PMUpcomingDeadlines";
import { PMHighPriorityTasks } from "./PMHighPriorityTasks";
import { PMTeamWorkload } from "./PMTeamWorkload";
import { PMRecentActivities } from "./PMRecentActivities";

interface PMDashboardClientProps {
    projects: any[];
    tasks: any[];
    members: any[];
    activities: any[];
}

export function PMDashboardClient({
    projects,
    tasks,
    members,
    activities,
}: PMDashboardClientProps) {
    // Calculate stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const teamMembers = members.length;

    // Get upcoming deadlines (tasks due in next 7 days, not completed)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingTasks = tasks
        .filter((t) => t.status !== "COMPLETED" && new Date(t.dueDate) <= nextWeek)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 10);

    // Get high priority tasks (not completed)
    const highPriorityTasks = tasks
        .filter((t) => t.priority === "HIGH" && t.status !== "COMPLETED")
        .slice(0, 5);

    // Calculate member workload
    const memberWorkload = members.map((member) => {
        const memberTasks = tasks.filter((t) => t.assignedTo?.id === member.id);
        const completed = memberTasks.filter((t) => t.status === "COMPLETED").length;
        const overdue = memberTasks.filter(
            (t) => t.status !== "COMPLETED" && new Date(t.dueDate) < new Date()
        ).length;

        return {
            ...member,
            totalTasks: memberTasks.length,
            completedTasks: completed,
            overdueTasks: overdue,
            completionRate: memberTasks.length === 0 ? 0 : Math.round((completed / memberTasks.length) * 100),
        };
    }).sort((a, b) => b.totalTasks - a.totalTasks);

    const stats = {
        totalProjects,
        activeProjects,
        totalTasks,
        completedTasks,
        completionRate,
        teamMembers,
    };

    return (
        <div className="space-y-6">
            <PMDashboardHeader />

            {/* Stats Cards */}
            <PMDashboardStats stats={stats} />

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Left Column - Project Summaries (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <PMProjectSummaries projects={projects} />
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <PMUpcomingDeadlines tasks={upcomingTasks} />
                    <PMHighPriorityTasks tasks={highPriorityTasks} />
                    <PMTeamWorkload members={memberWorkload} />
                </div>
            </div>

            {/* Recent Activities */}
            <PMRecentActivities activities={activities} />
        </div>
    );
}