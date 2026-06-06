"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, FolderKanban, PlayCircle, CheckCircle, ListTodo, CheckSquare, AlertCircle, TrendingUp } from "lucide-react";

interface AdminDashboardStatsProps {
    stats: {
        totalUsers: number;
        activeUsers: number;
        suspendedUsers: number;
        totalProjects: number;
        activeProjects: number;
        completedProjects: number;
        totalTasks: number;
        completedTasks: number;
        overdueTasks: number;
        completionRate: number;
    };
}

export function AdminDashboardStats({ stats }: AdminDashboardStatsProps) {
    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            icon: UserCheck,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Suspended Users",
            value: stats.suspendedUsers,
            icon: UserX,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Total Projects",
            value: stats.totalProjects,
            icon: FolderKanban,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Active Projects",
            value: stats.activeProjects,
            icon: PlayCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Completed Projects",
            value: stats.completedProjects,
            icon: CheckCircle,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Total Tasks",
            value: stats.totalTasks,
            icon: ListTodo,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Completed Tasks",
            value: stats.completedTasks,
            icon: CheckSquare,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Overdue Tasks",
            value: stats.overdueTasks,
            icon: AlertCircle,
            color: stats.overdueTasks > 0 ? "text-red-600" : "text-muted-foreground",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Completion Rate",
            value: `${stats.completionRate}%`,
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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