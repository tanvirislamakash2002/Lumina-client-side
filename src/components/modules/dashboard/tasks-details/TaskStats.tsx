"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Paperclip, Activity } from "lucide-react";

interface TaskStatsProps {
    stats: {
        commentCount: number;
        attachmentCount: number;
        activityCount: number;
    };
}

export function TaskStats({ stats }: TaskStatsProps) {
    const statCards = [
        {
            title: "Comments",
            value: stats.commentCount,
            icon: MessageSquare,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Attachments",
            value: stats.attachmentCount,
            icon: Paperclip,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Activities",
            value: stats.activityCount,
            icon: Activity,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
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