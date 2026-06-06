"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, CheckCircle, Clock, Circle, AlertCircle, TrendingUp } from "lucide-react";

interface ManagerTasksStatsProps {
    stats: {
        total: number;
        todo: number;
        inProgress: number;
        completed: number;
        overdue: number;
    } | null;
}

export function ManagerTasksStats({ stats }: ManagerTasksStatsProps) {
    if (!stats) return null;

    const statCards = [
        {
            title: "Total Tasks",
            value: stats.total,
            icon: ListTodo,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "To Do",
            value: stats.todo,
            icon: Circle,
            color: "text-gray-600",
            bgColor: "bg-gray-50 dark:bg-gray-950/30",
        },
        {
            title: "In Progress",
            value: stats.inProgress,
            icon: Clock,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Overdue",
            value: stats.overdue,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Completion Rate",
            value: stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100),
            suffix: "%",
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