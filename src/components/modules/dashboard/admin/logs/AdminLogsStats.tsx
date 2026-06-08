"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info, Users, Shield, LogIn, Activity, Database } from "lucide-react";

interface AdminLogsStatsProps {
    stats: {
        total: number;
        errors: number;
        warnings: number;
        info: number;
        adminActions: number;
        failedLogins: number;
    } | null;
}

export function AdminLogsStats({ stats }: AdminLogsStatsProps) {
    if (!stats) return null;

    const statCards = [
        {
            title: "Total Logs",
            value: stats.total.toLocaleString(),
            icon: Database,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Errors",
            value: stats.errors,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Warnings",
            value: stats.warnings,
            icon: AlertTriangle,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Info",
            value: stats.info.toLocaleString(),
            icon: Info,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Admin Actions",
            value: stats.adminActions,
            icon: Shield,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "Failed Logins",
            value: stats.failedLogins,
            icon: LogIn,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
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