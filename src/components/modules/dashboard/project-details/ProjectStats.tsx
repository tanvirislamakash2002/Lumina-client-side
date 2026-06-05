"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Users, AlertCircle } from "lucide-react";

interface ProjectStatsProps {
    totalTasks: number;
    completedTasks: number;
    memberCount: number;
    overdueTasks: number;
}

export function ProjectStats({ totalTasks, completedTasks, memberCount, overdueTasks }: ProjectStatsProps) {
    const stats = [
        {
            title: "Total Tasks",
            value: totalTasks,
            icon: Circle,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Completed Tasks",
            value: completedTasks,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Team Members",
            value: memberCount,
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Overdue Tasks",
            value: overdueTasks,
            icon: AlertCircle,
            color: overdueTasks > 0 ? "text-red-600" : "text-muted-foreground",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => {
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