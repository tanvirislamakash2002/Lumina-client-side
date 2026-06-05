"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { updateTaskStatus, deleteTask } from "@/actions/task.action";

interface TaskHeaderProps {
    task: any;
    canEdit: boolean;
    canDelete: boolean;
    userRole: string;
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

export function TaskHeader({ task, canEdit, canDelete, userRole, currentUserId }: TaskHeaderProps) {
    const router = useRouter();

    const handleStatusUpdate = async (newStatus: string) => {
        const toastId = toast.loading("Updating status...");
        const result = await updateTaskStatus(task.id, newStatus, task.project.id);
        if (result.success) {
            toast.success("Status updated", { id: toastId });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to update status", { id: toastId });
        }
    };

    const handleDeleteTask = async () => {
        const toastId = toast.loading("Deleting task...");
        const result = await deleteTask(task.id, task.project.id);
        if (result.success) {
            toast.success("Task deleted", { id: toastId });
            router.push(`/projects/${task.project.id}`);
        } else {
            toast.error(result.message || "Failed to delete task", { id: toastId });
        }
    };

    return (
        <div className="space-y-4">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-1"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={priorityColors[task.priority]}>
                            {task.priority}
                        </Badge>
                        <Badge className={statusColors[task.status]}>
                            {task.status.replace("_", " ")}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Status Dropdown */}
                    {canEdit && task.status !== "COMPLETED" && (
                        <Select value={task.status} onValueChange={handleStatusUpdate}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TODO">To Do</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    {/* Edit Button */}
                    {canEdit && (
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/tasks/${task.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    )}

                    {/* Delete Button */}
                    {canDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{task.title}"?
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
        </div>
    );
}