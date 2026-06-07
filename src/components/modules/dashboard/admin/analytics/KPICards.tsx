"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CheckSquare, TrendingUp, Activity, Clock, UserCheck, BarChart3 } from "lucide-react";

interface KPICardsProps {
    platformStats: {
        totalUsers: number;
        totalProjects: number;
        totalTasks: number;
        completedTasks: number;
        completionRate: number;
        activeProjects: number;
        newUsersThisWeek: number;
    } | null;
    systemStats: {
        userGrowthLastMonth: number;
        projectGrowthLastMonth: number;
        taskGrowthLastMonth: number;
        activeUsersLast30Days: number;
        dailyActiveUsers: { date: string; count: number }[];
    } | null;
}

export function KPICards({ platformStats, systemStats }: KPICardsProps) {
    if (!platformStats) return null;

    const kpiCards = [
        {
            title: "Total Users",
            value: platformStats.totalUsers.toLocaleString(),
            change: systemStats?.userGrowthLastMonth || 0,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Total Projects",
            value: platformStats.totalProjects.toLocaleString(),
            change: systemStats?.projectGrowthLastMonth || 0,
            icon: FolderKanban,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Total Tasks",
            value: platformStats.totalTasks.toLocaleString(),
            change: systemStats?.taskGrowthLastMonth || 0,
            icon: CheckSquare,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Completion Rate",
            value: `${platformStats.completionRate}%`,
            change: null,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950/30",
        },
        {
            title: "Active Projects",
            value: platformStats.activeProjects.toLocaleString(),
            change: null,
            icon: Activity,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Active Users (30d)",
            value: systemStats?.activeUsersLast30Days?.toLocaleString() || "0",
            change: null,
            icon: UserCheck,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "New Users (7d)",
            value: platformStats.newUsersThisWeek.toLocaleString(),
            change: null,
            icon: Users,
            color: "text-cyan-600",
            bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
        },
        {
            title: "Avg Tasks/User",
            value: Math.round(platformStats.totalTasks / platformStats.totalUsers).toLocaleString(),
            change: null,
            icon: BarChart3,
            color: "text-rose-600",
            bgColor: "bg-rose-50 dark:bg-rose-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                                <Icon className={`h-4 w-4 ${kpi.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            {kpi.change !== null && (
                                <p className={`text-xs ${kpi.change >= 0 ? "text-emerald-600" : "text-red-600"} mt-1`}>
                                    {kpi.change >= 0 ? "↑" : "↓"} {Math.abs(kpi.change)}% from last month
                                </p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}