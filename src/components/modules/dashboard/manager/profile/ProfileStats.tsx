"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, CheckCircle, Clock, Circle, AlertCircle, TrendingUp, FolderKanban } from "lucide-react";

interface ProfileStatsProps {
    workload: {
        total: number;
        completed: number;
        inProgress: number;
        todo: number;
        overdue: number;
        completionRate: number;
    } | null;
    projectsCount: number;
}

interface StatCard {
    title: string;
    value: number;
    icon: any;
    color: string;
    bgColor: string;
    suffix?: string;
}

export function ProfileStats({ workload, projectsCount }: ProfileStatsProps) {
    if (!workload) return null;

    const statCards: StatCard[] = [
        {
            title: "Total Tasks",
            value: workload.total,
            icon: ListTodo,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Completed",
            value: workload.completed,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "In Progress",
            value: workload.inProgress,
            icon: Clock,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "To Do",
            value: workload.todo,
            icon: Circle,
            color: "text-gray-600",
            bgColor: "bg-gray-50 dark:bg-gray-950/30",
        },
        {
            title: "Overdue",
            value: workload.overdue,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Projects",
            value: projectsCount,
            icon: FolderKanban,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Completion Rate",
            value: workload.completionRate,
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
            suffix: "%",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
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