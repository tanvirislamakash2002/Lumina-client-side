"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flag, User } from "lucide-react";
import { format } from "date-fns";

interface MemberTaskSidebarProps {
    task: any;
    currentUserId: string;
    onTaskUpdate: () => void;
}

const priorityColors: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function MemberTaskSidebar({ task, currentUserId, onTaskUpdate }: MemberTaskSidebarProps) {
    const isAssigned = task.assignedTo?.id === currentUserId;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Priority */}
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <Badge className={priorityColors[task.priority]}>
                        <Flag className="h-3 w-3 mr-1" />
                        {task.priority}
                    </Badge>
                </div>

                {/* Due Date */}
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            {format(new Date(task.dueDate), "MMMM dd, yyyy")}
                        </span>
                    </div>
                </div>

                {/* Assigned To */}
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            {task.assignedTo?.name || "Unassigned"}
                            {isAssigned && " (You)"}
                        </span>
                    </div>
                </div>

                {/* Status Note */}
                {isAssigned && task.status !== "COMPLETED" && (
                    <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            You can update the task status using the dropdown next to the task title.
                        </p>
                    </div>
                )}

                {task.status === "COMPLETED" && (
                    <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            This task has been completed. Great job!
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}