"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Briefcase, UserCheck, UserX, MailCheck } from "lucide-react";

interface UsersStatsProps {
    stats: {
        totalUsers: number;
        adminCount: number;
        projectManagerCount: number;
        teamMemberCount: number;
        activeUsers: number;
    };
}

export function UsersStats({ stats }: UsersStatsProps) {
    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Admins",
            value: stats.adminCount,
            icon: Shield,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "Project Managers",
            value: stats.projectManagerCount,
            icon: Briefcase,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Team Members",
            value: stats.teamMemberCount,
            icon: UserCheck,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            icon: UserX,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-5">
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