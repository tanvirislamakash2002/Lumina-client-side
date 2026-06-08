"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserCog, FolderX, CheckSquare, LogIn, AlertTriangle, Users, Trash2 } from "lucide-react";

interface AdminAuditStatsProps {
    stats: {
        total: number;
        roleChanges: number;
        userManagement: number;
        projectDeletions: number;
        taskDeletions: number;
        successfulLogins: number;
        failedLogins: number;
        sensitiveActions: number;
    } | null;
}

export function AdminAuditStats({ stats }: AdminAuditStatsProps) {
    if (!stats) return null;

    const statCards = [
        {
            title: "Total Events",
            value: stats.total.toLocaleString(),
            icon: Shield,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Role Changes",
            value: stats.roleChanges,
            icon: UserCog,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "User Management",
            value: stats.userManagement,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Project Deletions",
            value: stats.projectDeletions,
            icon: FolderX,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Task Deletions",
            value: stats.taskDeletions,
            icon: Trash2,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Successful Logins",
            value: stats.successfulLogins.toLocaleString(),
            icon: LogIn,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Failed Logins",
            value: stats.failedLogins,
            icon: AlertTriangle,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Sensitive Actions",
            value: stats.sensitiveActions,
            icon: Shield,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
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