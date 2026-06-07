"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Calendar, User, Flag } from "lucide-react";
import { format } from "date-fns";
import { updateTaskStatus } from "@/actions/task.action";
import { toast } from "sonner";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TaskDetailsHeaderProps {
    task: any;
    canEdit: boolean;
    canDelete: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onRefresh: () => void;
    currentUserId: string;
    userRole: string;
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

export function TaskDetailsHeader({
    task,
    canEdit,
    canDelete,
    onEdit,
    onDelete,
    onRefresh,
    currentUserId,
    userRole,
}: TaskDetailsHeaderProps) {
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const result = await updateTaskStatus(task.id, newStatus, task.projectId);
            if (result.success) {
                toast.success(`Task status updated to ${newStatus.replace("_", " ")}`);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getDaysUntil = (dueDate: string) => {
        const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (days < 0) return "Overdue";
        if (days === 0) return "Today";
        if (days === 1) return "Tomorrow";
        return `${days} days left`;
    };

    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/tasks">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{task.title}</h1>
                    {canEdit ? (
                        <Select
                            value={task.status}
                            onValueChange={handleStatusChange}
                            disabled={updatingStatus}
                        >
                            <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TODO">To Do</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <Badge className={statusColors[task.status]}>
                            {task.status.replace("_", " ")}
                        </Badge>
                    )}
                    <Badge className={priorityColors[task.priority]}>
                        <Flag className="h-3 w-3 mr-1" />
                        {task.priority}
                    </Badge>
                    {isOverdue && task.status !== "COMPLETED" && (
                        <Badge variant="destructive">Overdue</Badge>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                        <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                            ({getDaysUntil(task.dueDate)})
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>
                            Assigned to: {task.assignedTo?.name || "Unassigned"}
                        </span>
                    </div>
                    <div>
                        Created: {format(new Date(task.createdAt), "MMM dd, yyyy")}
                    </div>
                    {task.updatedAt !== task.createdAt && (
                        <div>
                            Updated: {format(new Date(task.updatedAt), "MMM dd, yyyy")}
                        </div>
                    )}
                </div>
            </div>

            {(canEdit || canDelete) && (
                <div className="flex gap-2">
                    {canEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    )}
                    {canDelete && (
                        <Button variant="destructive" onClick={onDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}