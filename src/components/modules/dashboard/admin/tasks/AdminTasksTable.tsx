"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Trash2, Calendar, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { deleteTask } from "@/actions/task.action";

interface AdminTasksTableProps {
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

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function AdminTasksTable({ tasks, onRefresh }: AdminTasksTableProps) {
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTasks(tasks.map((t) => t.id));
        } else {
            setSelectedTasks([]);
        }
    };

    const handleSelectTask = (taskId: string, checked: boolean) => {
        if (checked) {
            setSelectedTasks([...selectedTasks, taskId]);
        } else {
            setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
        }
    };

    const handleDelete = async () => {
        if (!taskToDelete) return;

        setIsLoading(true);
        try {
            const result = await deleteTask(taskToDelete.id, taskToDelete.projectId);
            if (result.success) {
                toast.success(`Task "${taskToDelete.title}" deleted successfully`);
                setDeleteDialogOpen(false);
                setTaskToDelete(null);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to delete task");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        setIsLoading(true);
        let successCount = 0;
        let failCount = 0;

        for (const taskId of selectedTasks) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                try {
                    const result = await deleteTask(taskId, task.projectId);
                    if (result.success) {
                        successCount++;
                    } else {
                        failCount++;
                    }
                } catch (error) {
                    failCount++;
                }
            }
        }

        toast.success(`${successCount} task(s) deleted successfully${failCount > 0 ? `, ${failCount} failed` : ""}`);
        setBulkDeleteDialogOpen(false);
        setSelectedTasks([]);
        onRefresh();
        setIsLoading(false);
    };

    if (tasks.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <CheckSquareIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No tasks found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your filters to find tasks.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr className="text-left text-sm font-medium">
                                    <th className="w-12 p-4">
                                        <Checkbox
                                            checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-4">Task Title</th>
                                    <th className="p-4">Project</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Priority</th>
                                    <th className="p-4">Assigned To</th>
                                    <th className="p-4">Due Date</th>
                                    <th className="p-4">Created</th>
                                    <th className="p-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => {
                                    const isSelected = selectedTasks.includes(task.id);
                                    const deadlineInfo = getDaysUntil(task.dueDate);
                                    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";
                                    const isSelectedTask = selectedTasks.includes(task.id);

                                    return (
                                        <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="p-4">
                                                <Checkbox
                                                    checked={isSelectedTask}
                                                    onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                                                />
                                            </td>
                                            <td className="p-4">
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
                                            </td>
                                            <td className="p-4">
                                                <Link
                                                    href={`/dashboard/projects/${task.project?.id}`}
                                                    className="text-sm hover:text-indigo-600 transition-colors"
                                                >
                                                    {task.project?.name}
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={statusColors[task.status]}>
                                                    {task.status.replace("_", " ")}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={priorityColors[task.priority]}>
                                                    {task.priority}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {task.assignedTo ? (
                                                    <Link
                                                        href={`/dashboard/users/${task.assignedTo.id}`}
                                                        className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                                                    >
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={task.assignedTo.image || undefined} />
                                                            <AvatarFallback className="text-xs">
                                                                {getInitials(task.assignedTo.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">{task.assignedTo.name}</span>
                                                    </Link>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" : deadlineInfo.color}`}>
                                                        {deadlineInfo.text}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">
                                                {format(new Date(task.createdAt), "MMM dd, yyyy")}
                                            </td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/tasks/${task.id}`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setTaskToDelete(task);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete Task
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                         </table>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Delete Button */}
            {selectedTasks.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        variant="destructive"
                        onClick={() => setBulkDeleteDialogOpen(true)}
                        className="shadow-lg gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Selected ({selectedTasks.length})
                    </Button>
                </div>
            )}

            {/* Single Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
                            All comments and attachments will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Dialog */}
            <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Multiple Tasks</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedTasks.length} task(s)? This action cannot be undone.
                            All comments and attachments will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleBulkDelete} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete {selectedTasks.length} Task(s)
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function CheckSquareIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" />
        </svg>
    );
}