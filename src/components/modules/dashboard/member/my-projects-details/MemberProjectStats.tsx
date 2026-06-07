"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface MemberProjectStatsProps {
    stats: any;
}

export function MemberProjectStats({ stats }: MemberProjectStatsProps) {
    if (!stats) return null;

    const statCards = [
        {
            title: "Total Tasks",
            value: stats.totalTasks || 0,
            icon: ListTodo,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Completed",
            value: stats.completedTasks || 0,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "In Progress",
            value: stats.inProgressTasks || 0,
            icon: Clock,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Overdue",
            value: stats.overdueTasks || 0,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
    ];

    const completionRate = stats.totalTasks === 0 
        ? 0 
        : Math.round((stats.completedTasks / stats.totalTasks) * 100);

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30">
                        <TrendingUp className="h-4 w-4 text-indigo-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completionRate}%</div>
                </CardContent>
            </Card>
        </div>
    );
}