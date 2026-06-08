"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, ListTodo, CheckCircle, Clock, AlertCircle, Users } from "lucide-react";
import { format } from "date-fns";

interface AdminProjectOverviewProps {
    project: any;
    stats: any;
    memberCount: number;
}

const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: "Overdue", color: "text-red-600" };
    if (days === 0) return { text: "Due today", color: "text-amber-600" };
    if (days === 1) return { text: "Due tomorrow", color: "text-amber-600" };
    return { text: `${days} days left`, color: "text-muted-foreground" };
};

export function AdminProjectOverview({ project, stats, memberCount }: AdminProjectOverviewProps) {
    const deadlineInfo = getDaysUntilDeadline(project.deadline);
    const totalTasks = stats?.totalTasks || 0;
    const completedTasks = stats?.completedTasks || 0;
    const inProgressTasks = stats?.inProgressTasks || 0;
    const overdueTasks = stats?.overdueTasks || 0;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const statCards = [
        {
            title: "Total Tasks",
            value: totalTasks,
            icon: ListTodo,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Completed",
            value: completedTasks,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "In Progress",
            value: inProgressTasks,
            icon: Clock,
            color: "text-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
        },
        {
            title: "Overdue",
            value: overdueTasks,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Members",
            value: memberCount,
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
        },
    ];

    return (
        <>
            <div className="grid gap-4 grid-cols-5">
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
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Description and Deadline */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>About This Project</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {project.description ? (
                                <p className="text-muted-foreground">{project.description}</p>
                            ) : (
                                <p className="text-muted-foreground italic">No description provided.</p>
                            )}
                            <div className="flex items-center gap-2 pt-2 border-t">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Deadline: {format(new Date(project.deadline), "MMMM dd, yyyy")}</span>
                                <span className={`text-sm font-medium ${deadlineInfo.color}`}>
                                    ({deadlineInfo.text})
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress and Stats */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Completion</span>
                                <span className="font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                                {completedTasks} of {totalTasks} tasks completed
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    );
}