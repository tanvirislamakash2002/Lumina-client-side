"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

interface UpcomingDeadlinesProps {
    data: Array<{
        id: string;
        title: string;
        dueDate: string;
        daysUntil: number;
        priority: string;
        project: { id: string; name: string };
        assignedTo: { id: string; name: string; image: string | null } | null;
    }> | null;
}

const priorityColors: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    LOW: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function UpcomingDeadlines({ data }: UpcomingDeadlinesProps) {
    const deadlines = data || [];

    if (deadlines.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-6">
                        No upcoming deadlines. Great job staying on track!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Deadlines</CardTitle>
                <Link 
                    href="/my-tasks" 
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                    View all
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-3">
                {deadlines.map((task) => (
                    <Link 
                        key={task.id} 
                        href={`/tasks/${task.id}`}
                        className="block group"
                    >
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium group-hover:text-indigo-600 transition-colors truncate">
                                        {task.title}
                                    </h4>
                                    <Badge className={priorityColors[task.priority]}>
                                        {task.priority}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {task.project.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className={`text-sm font-medium whitespace-nowrap ${
                                    task.daysUntil <= 1 ? "text-red-500" : ""
                                }`}>
                                    {task.daysUntil === 0 
                                        ? "Today" 
                                        : task.daysUntil === 1 
                                            ? "Tomorrow" 
                                            : `${task.daysUntil} days`}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}