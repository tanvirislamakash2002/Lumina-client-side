"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, Eye, AlertCircle, Loader2, Circle, PlayCircle, CheckCircle } from "lucide-react";
import { updateTaskStatus } from "@/actions/task.action";
import { toast } from "sonner";
import { useState } from "react";

interface MyTasksTableProps {
    tasks: any[];
    onRefresh: () => void;
}

const statusColors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const priorityColors: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const getDaysUntil = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: "Overdue", color: "text-red-600" };
    if (days === 0) return { text: "Today", color: "text-amber-600" };
    if (days === 1) return { text: "Tomorrow", color: "text-amber-600" };
    return { text: `${days} days`, color: "text-muted-foreground" };
};

export function MyTasksTable({ tasks, onRefresh }: MyTasksTableProps) {
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    const handleStatusChange = async (taskId: string, projectId: string, newStatus: string) => {
        setUpdatingTaskId(taskId);
        try {
            const result = await updateTaskStatus(taskId, newStatus, projectId);
            if (result.success) {
                toast.success(`Task status updated to ${newStatus.replace("_", " ")}`);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to update task status");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setUpdatingTaskId(null);
        }
    };

    if (tasks.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <UserCheckIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No tasks assigned</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            You don't have any tasks assigned to you at the moment.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Task Title</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => {
                                const deadlineInfo = getDaysUntil(task.dueDate);
                                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";

                                return (
                                    <TableRow key={task.id} className={isOverdue ? "bg-red-50/50 dark:bg-red-950/20" : ""}>
                                        <TableCell>
                                            <Link
                                                href={`/dashboard/tasks/${task.id}`}
                                                className="font-medium hover:text-indigo-600 transition-colors"
                                            >
                                                {task.title}
                                            </Link>
                                            {task.description && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                    {task.description}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/dashboard/projects/${task.project?.id}`}
                                                className="text-sm hover:text-indigo-600 transition-colors"
                                            >
                                                {task.project?.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={task.status}
                                                onValueChange={(value) => handleStatusChange(task.id, task.project?.id, value)}
                                                disabled={updatingTaskId === task.id}
                                            >
                                                <SelectTrigger className="w-28 h-8">
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
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={priorityColors[task.priority]}>
                                                {task.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" : deadlineInfo.color}`}>
                                                    {deadlineInfo.text}
                                                </span>
                                                {isOverdue && (
                                                    <AlertCircle className="h-3 w-3 text-red-500 ml-1" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/tasks/${task.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

function UserCheckIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
        </svg>
    );
}