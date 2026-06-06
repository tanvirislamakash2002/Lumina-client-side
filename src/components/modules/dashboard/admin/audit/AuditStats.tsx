"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, TrendingUp, Calendar } from "lucide-react";

interface AuditStatsProps {
    stats: {
        totalActions: number;
        uniqueUsers: number;
        mostCommonAction: string;
        actionsToday: number;
    };
}

export function AuditStats({ stats }: AuditStatsProps) {
    const statCards = [
        {
            title: "Total Actions",
            value: stats.totalActions,
            icon: Activity,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Unique Users",
            value: stats.uniqueUsers,
            icon: Users,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Most Common Action",
            value: stats.mostCommonAction.replace(/_/g, " "),
            icon: TrendingUp,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Actions Today",
            value: stats.actionsToday,
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
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