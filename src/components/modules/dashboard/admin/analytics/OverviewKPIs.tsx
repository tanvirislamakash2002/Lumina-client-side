"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, FolderKanban, ListTodo, CheckSquare, TrendingUp, Clock, Activity } from "lucide-react";

interface OverviewKPIsProps {
    activityStats: any;
    userStats: any;
    projectStats: any;
    completionStats: any;
    compare: boolean;
}

export function OverviewKPIs({ activityStats, userStats, projectStats, completionStats, compare }: OverviewKPIsProps) {
    // Format numbers with K/M suffix
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    const kpiCards = [
        {
            title: "Total Users",
            value: formatNumber(userStats?.totalUsers || 0),
            icon: Users,
            trend: userStats?.userGrowthLastMonth || 0,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Active Users (30d)",
            value: formatNumber(activityStats?.uniqueUsersCount || 0),
            icon: UserCheck,
            trend: null,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Total Projects",
            value: formatNumber(projectStats?.total || 0),
            icon: FolderKanban,
            trend: null,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Total Tasks",
            value: formatNumber(completionStats?.totalCompletedTasks || 0),
            icon: ListTodo,
            trend: null,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Completed Tasks",
            value: formatNumber(completionStats?.totalCompletedTasks || 0),
            icon: CheckSquare,
            trend: null,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Completion Rate",
            value: `${completionStats?.completionByPriority?.[0]?.rate || 0}%`,
            icon: TrendingUp,
            trend: null,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "Avg Completion Time",
            value: `${completionStats?.avgCompletionDays || 0} days`,
            icon: Clock,
            trend: null,
            color: "text-cyan-600",
            bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
        },
        {
            title: "Total Activities",
            value: formatNumber(activityStats?.totalActivities || 0),
            icon: Activity,
            trend: null,
            color: "text-rose-600",
            bgColor: "bg-rose-50 dark:bg-rose-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((stat) => {
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
                            {stat.trend !== null && compare && (
                                <p className={`text-xs ${stat.trend >= 0 ? "text-emerald-600" : "text-red-600"} mt-1`}>
                                    {stat.trend >= 0 ? "↑" : "↓"} {Math.abs(stat.trend)}% vs previous
                                </p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}