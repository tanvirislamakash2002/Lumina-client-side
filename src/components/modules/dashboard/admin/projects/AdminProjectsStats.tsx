"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, PlayCircle, CheckCircle, PauseCircle } from "lucide-react";

interface AdminProjectsStatsProps {
    stats: {
        total: number;
        active: number;
        completed: number;
        onHold: number;
    };
}

export function AdminProjectsStats({ stats }: AdminProjectsStatsProps) {
    const statCards = [
        {
            title: "Total Projects",
            value: stats.total,
            icon: FolderKanban,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Active Projects",
            value: stats.active,
            icon: PlayCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Completed Projects",
            value: stats.completed,
            icon: CheckCircle,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "On Hold Projects",
            value: stats.onHold,
            icon: PauseCircle,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-4">
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