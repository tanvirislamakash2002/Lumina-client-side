"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ListTodo, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface MemberDashboardStatsProps {
    stats: {
        totalProjects: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        overdueTasks: number;
        completionRate: number;
    };
}

export function MemberDashboardStats({ stats }: MemberDashboardStatsProps) {
    const statCards = [
        {
            title: "My Projects",
            value: stats.totalProjects,
            icon: FolderKanban,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "My Tasks",
            value: stats.totalTasks,
            icon: ListTodo,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Completed",
            value: stats.completedTasks,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Pending",
            value: stats.pendingTasks,
            icon: Clock,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Overdue",
            value: stats.overdueTasks,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Completion Rate",
            value: `${stats.completionRate}%`,
            icon: TrendingUp,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}