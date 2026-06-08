"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, PlayCircle, CheckCircle, PauseCircle, AlertCircle, TrendingUp, ListTodo, Users } from "lucide-react";

interface AdminProjectsStatsProps {
    stats: {
        total: number;
        active: number;
        completed: number;
        onHold: number;
    } | null;
}

export function AdminProjectsStats({ stats }: AdminProjectsStatsProps) {
    if (!stats) return null;

    // Calculate additional stats (these would come from API in production)
    const averageCompletionRate = 68;
    const totalTasks = 1247;
    const totalMembers = 89;
    const overdueProjects = 3;

    const statCards = [
        {
            title: "Total Projects",
            value: stats.total,
            icon: FolderKanban,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Active",
            value: stats.active,
            icon: PlayCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "On Hold",
            value: stats.onHold,
            icon: PauseCircle,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Overdue",
            value: overdueProjects,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Avg Completion",
            value: averageCompletionRate,
            suffix: "%",
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Total Tasks",
            value: totalTasks,
            icon: ListTodo,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "Total Members",
            value: totalMembers,
            icon: Users,
            color: "text-cyan-600",
            bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
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
                            <div className="text-2xl font-bold">
                                {stat.value}{stat.suffix || ""}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}