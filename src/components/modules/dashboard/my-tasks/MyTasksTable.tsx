"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateTaskStatus } from "@/actions/task.action";

interface MyTasksTableProps {
    tasks: any[];
    currentUserId: string;
}

const priorityColors: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const statusColors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const getRelativeDueDate = (dueDate: string, status: string) => {
    if (status === "COMPLETED") return { text: "Completed", color: "text-muted-foreground" };

    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: "Overdue", color: "text-red-500" };
    if (days === 0) return { text: "Today", color: "text-amber-500" };
    if (days === 1) return { text: "Tomorrow", color: "text-amber-500" };
    return { text: `${days} days left`, color: "text-muted-foreground" };
};

export function MyTasksTable({ tasks, currentUserId }: MyTasksTableProps) {
    const handleStatusUpdate = async (taskId: string, projectId: string, newStatus: string) => {
        const toastId = toast.loading("Updating task status...");
        const result = await updateTaskStatus(taskId, newStatus, projectId);
        if (result.success) {
            toast.success("Task status updated", { id: toastId });
        } else {
            toast.error(result.message || "Failed to update status", { id: toastId });
        }
    };

    if (tasks.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No tasks assigned</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        You're all caught up! No tasks are currently assigned to you.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="divide-y">
                    {tasks.map((task) => {
                        const dueDateInfo = getRelativeDueDate(task.dueDate, task.status);
                        
                        return (
                            <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    {/* Left Section - Task Info */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Link href={`/tasks/${task.id}`}>
                                                <h4 className="font-medium hover:text-indigo-600 transition-colors">
                                                    {task.title}
                                                </h4>
                                            </Link>
                                            <Badge className={priorityColors[task.priority]}>
                                                {task.priority}
                                            </Badge>
                                            <Badge className={statusColors[task.status]}>
                                                {task.status.replace("_", " ")}
                                            </Badge>
                                        </div>
                                        
                                        {task.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {task.description}
                                            </p>
                                        )}
                                        
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <Link href={`/projects/${task.project.id}`}>
                                                <span className="hover:text-indigo-600">
                                                    {task.project.name}
                                                </span>
                                            </Link>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span className={dueDateInfo.color}>
                                                    {dueDateInfo.text}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section - Actions */}
                                    <div className="flex items-center gap-2">
                                        {/* Quick Status Update */}
                                        {task.status !== "COMPLETED" && (
                                            <Select
                                                value={task.status}
                                                onValueChange={(value) => handleStatusUpdate(task.id, task.project.id, value)}
                                            >
                                                <SelectTrigger className="w-[120px] h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="TODO">To Do</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}

                                        {/* View Details */}
                                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                            <Link href={`/tasks/${task.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}