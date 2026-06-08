"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, CheckCircle, Clock, Circle, AlertCircle, TrendingUp, FolderKanban, MessageSquare } from "lucide-react";

interface AdminUserStatsProps {
    stats: any;
}

interface StatCard {
    title: string;
    value: number;
    icon: any;
    color: string;
    bgColor: string;
    suffix?: string;
}

export function AdminUserStats({ stats }: AdminUserStatsProps) {
    if (!stats) return null;

    const statCards: StatCard[] = [
        {
            title: "Total Tasks",
            value: stats.stats?.totalTasks || 0,
            icon: ListTodo,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Completed",
            value: stats.stats?.completedTasks || 0,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "In Progress",
            value: stats.stats?.inProgressTasks || 0,
            icon: Clock,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "To Do",
            value: stats.stats?.todoTasks || 0,
            icon: Circle,
            color: "text-gray-600",
            bgColor: "bg-gray-50 dark:bg-gray-950/30",
        },
        {
            title: "Overdue",
            value: stats.stats?.overdueTasks || 0,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Projects",
            value: stats.stats?.projectsCount || 0,
            icon: FolderKanban,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Completion Rate",
            value: stats.stats?.completionRate || 0,
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
            suffix: "%",
        },
        {
            title: "Comments",
            value: stats.user?._count?.comments || 0,
            icon: MessageSquare,
            color: "text-rose-600",
            bgColor: "bg-rose-50 dark:bg-rose-950/30",
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
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