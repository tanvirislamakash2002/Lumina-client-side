"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight } from "lucide-react";

interface HighPriorityTasksProps {
    data: Array<{
        id: string;
        title: string;
        dueDate: string;
        status: string;
        project: { id: string; name: string };
        assignedTo: { id: string; name: string; image: string | null } | null;
    }> | null;
}

const statusColors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function HighPriorityTasks({ data }: HighPriorityTasksProps) {
    const tasks = data || [];

    if (tasks.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>High Priority Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-6">
                        No high priority tasks. Everything is under control!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>High Priority Tasks</CardTitle>
                <Link 
                    href="/my-tasks?priority=HIGH" 
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                    View all
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-3">
                {tasks.map((task) => (
                    <Link 
                        key={task.id} 
                        href={`/tasks/${task.id}`}
                        className="block group"
                    >
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium group-hover:text-indigo-600 transition-colors truncate">
                                        {task.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {task.project.name}
                                    </p>
                                </div>
                            </div>
                            <Badge className={statusColors[task.status]}>
                                {task.status.replace("_", " ")}
                            </Badge>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}