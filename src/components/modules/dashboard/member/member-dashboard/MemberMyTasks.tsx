"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateTaskStatus } from "@/actions/task.action";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, Circle, Loader2, PlayCircle } from "lucide-react";

interface MemberMyTasksProps {
    todoTasks: any[];
    inProgressTasks: any[];
    recentCompletedTasks: any[];
}

const statusColors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const priorityColors: Record<string, string> = {
    HIGH: "text-red-600 bg-red-50 dark:bg-red-950/30",
    MEDIUM: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
    LOW: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
};

export function MemberMyTasks({ todoTasks, inProgressTasks, recentCompletedTasks }: MemberMyTasksProps) {
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    const handleStatusChange = async (taskId: string, projectId: string, newStatus: string) => {
        setUpdatingTaskId(taskId);
        try {
            const result = await updateTaskStatus(taskId, newStatus, projectId);
            if (result.success) {
                toast.success(`Task status updated to ${newStatus.replace("_", " ")}`);
                // Refresh will happen via revalidateTag
            } else {
                toast.error(result.message || "Failed to update task status");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setUpdatingTaskId(null);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Tasks</CardTitle>
                <Link href="/tasks/my-tasks" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View all tasks
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Todo Tasks Section */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Circle className="h-4 w-4 text-gray-400" />
                        <h3 className="font-medium">To Do</h3>
                        <Badge variant="secondary" className="ml-auto">{todoTasks.length}</Badge>
                    </div>
                    <div className="space-y-2">
                        {todoTasks.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No pending tasks. Great job!
                            </p>
                        ) : (
                            todoTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/tasks/${task.id}`} className="font-medium hover:text-indigo-600 transition-colors">
                                            {task.title}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge className={priorityColors[task.priority]} variant="secondary">
                                                {task.priority}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {task.project?.name}
                                            </span>
                                        </div>
                                    </div>
                                    <Select
                                        value={task.status}
                                        onValueChange={(value) => handleStatusChange(task.id, task.project?.id, value)}
                                        disabled={updatingTaskId === task.id}
                                    >
                                        <SelectTrigger className="w-32 h-8">
                                            {updatingTaskId === task.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <SelectValue />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">
                                                <div className="flex items-center gap-2">
                                                    <Circle className="h-3 w-3" />
                                                    To Do
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="IN_PROGRESS">
                                                <div className="flex items-center gap-2">
                                                    <PlayCircle className="h-3 w-3" />
                                                    In Progress
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="COMPLETED">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Completed
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* In Progress Tasks Section */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <PlayCircle className="h-4 w-4 text-blue-500" />
                        <h3 className="font-medium">In Progress</h3>
                        <Badge variant="secondary" className="ml-auto">{inProgressTasks.length}</Badge>
                    </div>
                    <div className="space-y-2">
                        {inProgressTasks.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No tasks in progress.
                            </p>
                        ) : (
                            inProgressTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/tasks/${task.id}`} className="font-medium hover:text-indigo-600 transition-colors">
                                            {task.title}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge className={priorityColors[task.priority]} variant="secondary">
                                                {task.priority}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {task.project?.name}
                                            </span>
                                        </div>
                                    </div>
                                    <Select
                                        value={task.status}
                                        onValueChange={(value) => handleStatusChange(task.id, task.project?.id, value)}
                                        disabled={updatingTaskId === task.id}
                                    >
                                        <SelectTrigger className="w-32 h-8">
                                            {updatingTaskId === task.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <SelectValue />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">
                                                <div className="flex items-center gap-2">
                                                    <Circle className="h-3 w-3" />
                                                    To Do
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="IN_PROGRESS">
                                                <div className="flex items-center gap-2">
                                                    <PlayCircle className="h-3 w-3" />
                                                    In Progress
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="COMPLETED">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Completed
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recently Completed Section */}
                {recentCompletedTasks.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <h3 className="font-medium">Recently Completed</h3>
                        </div>
                        <div className="space-y-2">
                            {recentCompletedTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 opacity-75">
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/tasks/${task.id}`} className="font-medium hover:text-indigo-600 transition-colors">
                                            {task.title}
                                        </Link>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {task.project?.name}
                                        </p>
                                    </div>
                                    <Badge className={statusColors[task.status]}>
                                        Completed
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}