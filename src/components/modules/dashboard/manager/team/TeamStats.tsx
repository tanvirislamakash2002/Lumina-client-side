"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, UserCheck, UserCircle, Briefcase, CheckCircle, AlertCircle } from "lucide-react";

interface TeamStatsProps {
    userStats: {
        totalUsers: number;
        adminCount: number;
        projectManagerCount: number;
        teamMemberCount: number;
        activeUsers: number;
    } | null;
    teamStats: {
        overview: {
            totalTasksAssigned: number;
            completedTasks: number;
            overallCompletionRate: number;
        };
    } | null;
}

interface StatCard {
    title: string;
    value: number;
    icon: any;
    color: string;
    bgColor: string;
    suffix?: string;
}

export function TeamStats({ userStats, teamStats }: TeamStatsProps) {
    if (!userStats) return null;

    const statCards: StatCard[] = [
        {
            title: "Total Members",
            value: userStats.totalUsers,
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Admins",
            value: userStats.adminCount,
            icon: UserCog,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "Project Managers",
            value: userStats.projectManagerCount,
            icon: Briefcase,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Team Members",
            value: userStats.teamMemberCount,
            icon: UserCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Active Members",
            value: userStats.activeUsers,
            icon: UserCheck,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
    ];

    if (teamStats) {
        statCards.push(
            {
                title: "Total Tasks Assigned",
                value: teamStats.overview.totalTasksAssigned,
                icon: Briefcase,
                color: "text-amber-600",
                bgColor: "bg-amber-50 dark:bg-amber-950/30",
            },
            {
                title: "Team Completion Rate",
                value: teamStats.overview.overallCompletionRate,
                suffix: "%",
                icon: CheckCircle,
                color: "text-emerald-600",
                bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
            }
        );
    }

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