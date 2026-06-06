"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, AlertCircle } from "lucide-react";

interface MemberUpcomingDeadlinesProps {
    tasks: any[];
}

const priorityColors: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function MemberUpcomingDeadlines({ tasks }: MemberUpcomingDeadlinesProps) {
    if (tasks.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-6">
                        No upcoming deadlines. Great job staying on track!
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getDaysUntil = (dueDate: string) => {
        const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (days < 0) return "Overdue";
        if (days === 0) return "Today";
        if (days === 1) return "Tomorrow";
        return `${days} days`;
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Deadlines</CardTitle>
                <Link href="/tasks/my-tasks" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View all
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-3">
                {tasks.map((task) => {
                    const overdue = isOverdue(task.dueDate);
                    return (
                        <Link key={task.id} href={`/tasks/${task.id}`} className="block group">
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        {overdue && <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                                        <h4 className={`font-medium group-hover:text-indigo-600 transition-colors truncate ${overdue ? "text-red-600" : ""}`}>
                                            {task.title}
                                        </h4>
                                        <Badge className={priorityColors[task.priority]}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{task.project?.name}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className={`text-sm font-medium whitespace-nowrap ${overdue ? "text-red-600" : ""}`}>
                                        {getDaysUntil(task.dueDate)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </CardContent>
        </Card>
    );
}