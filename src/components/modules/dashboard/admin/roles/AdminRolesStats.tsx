"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Briefcase, UserCircle, OctagonAlert } from "lucide-react";

interface AdminRolesStatsProps {
    stats: {
        total: number;
        admin: number;
        projectManager: number;
        teamMember: number;
        suspended: number;
    } | null;
}

export function AdminRolesStats({ stats }: AdminRolesStatsProps) {
    if (!stats) return null;

    const statCards = [
        {
            title: "Total Users",
            value: stats.total,
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Administrators",
            value: stats.admin,
            icon: Shield,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
            warning: stats.admin === 1,
        },
        {
            title: "Project Managers",
            value: stats.projectManager,
            icon: Briefcase,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Team Members",
            value: stats.teamMember,
            icon: UserCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Suspended",
            value: stats.suspended,
            icon: OctagonAlert,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-5">
            {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.title} className={stat.warning ? "border-amber-300 dark:border-amber-800" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            {stat.warning && (
                                <p className="text-xs text-amber-600 mt-1">Only one admin</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}