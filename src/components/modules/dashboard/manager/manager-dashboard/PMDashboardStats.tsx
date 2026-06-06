"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, PlayCircle, ListTodo, CheckCircle, TrendingUp, Users } from "lucide-react";

interface PMDashboardStatsProps {
    stats: {
        totalProjects: number;
        activeProjects: number;
        totalTasks: number;
        completedTasks: number;
        completionRate: number;
        teamMembers: number;
    };
}

export function PMDashboardStats({ stats }: PMDashboardStatsProps) {
    const statCards = [
        {
            title: "Total Projects",
            value: stats.totalProjects,
            icon: FolderKanban,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Active Projects",
            value: stats.activeProjects,
            icon: PlayCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Total Tasks",
            value: stats.totalTasks,
            icon: ListTodo,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Completed Tasks",
            value: stats.completedTasks,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Completion Rate",
            value: `${stats.completionRate}%`,
            icon: TrendingUp,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Team Members",
            value: stats.teamMembers,
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
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