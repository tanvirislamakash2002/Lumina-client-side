"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    FolderKanban, 
    CheckSquare, 
    TrendingUp, 
    AlertCircle 
} from "lucide-react";

interface KPICardsProps {
    data: {
        totalProjects?: number;
        activeProjects?: number;
        totalTasks?: number;
        completedTasks?: number;
        pendingTasks?: number;
        overdueTasks?: number;
        completionRate?: number;
    } | null;
}

export function KPICards({ data }: KPICardsProps) {
    const kpiData = {
        totalProjects: data?.totalProjects ?? 0,
        activeProjects: data?.activeProjects ?? 0,
        totalTasks: data?.totalTasks ?? 0,
        completedTasks: data?.completedTasks ?? 0,
        pendingTasks: data?.pendingTasks ?? 0,
        overdueTasks: data?.overdueTasks ?? 0,
        completionRate: data?.completionRate ?? 0,
    };

    const cards = [
        {
            title: "Total Projects",
            value: kpiData.totalProjects,
            icon: FolderKanban,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
        },
        {
            title: "Active Projects",
            value: kpiData.activeProjects,
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Total Tasks",
            value: kpiData.totalTasks,
            icon: CheckSquare,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Completion Rate",
            value: `${kpiData.completionRate}%`,
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${card.bgColor}`}>
                                <Icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            {card.title === "Completion Rate" && kpiData.totalTasks > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {kpiData.completedTasks} / {kpiData.totalTasks} tasks completed
                                </p>
                            )}
                            {card.title === "Total Tasks" && kpiData.overdueTasks > 0 && (
                                <p className="text-xs text-red-500 mt-1">
                                    {kpiData.overdueTasks} overdue
                                </p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}