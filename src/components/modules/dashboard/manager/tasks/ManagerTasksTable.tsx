"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Edit, Trash2, Eye, Calendar, User, MessageSquare, Paperclip } from "lucide-react";
import { updateTaskStatus } from "@/actions/task.action";
import { toast } from "sonner";
import { useState } from "react";

interface ManagerTasksTableProps {
    tasks: any[];
    selectedTasks: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectTask: (taskId: string, checked: boolean) => void;
    onEdit: (task: any) => void;
    onDelete: (task: any) => void;
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

export function ManagerTasksTable({
    tasks,
    selectedTasks,
    onSelectAll,
    onSelectTask,
    onEdit,
    onDelete,
    onRefresh,
}: ManagerTasksTableProps) {
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    const handleStatusChange = async (taskId: string, projectId: string, newStatus: string) => {
        setUpdatingTaskId(taskId);
        try {
            const result = await updateTaskStatus(taskId, newStatus, projectId);
            if (result.success) {
                toast.success(`Task status updated`);
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
                            <ListTodoIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No tasks found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {selectedTasks.length > 0
                                ? "No tasks match your filters."
                                : "Get started by creating your first task."}
                        </p>
                        {selectedTasks.length === 0 && (
                            <Button asChild className="mt-2">
                                <Link href="/dashboard/tasks/create">Create Task</Link>
                            </Button>
                        )}
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
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                                        onCheckedChange={onSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Task Title</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Comments</TableHead>
                                <TableHead>Files</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => {
                                const isSelected = selectedTasks.includes(task.id);
                                const deadlineInfo = getDaysUntil(task.dueDate);
                                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";

                                return (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={(checked) => onSelectTask(task.id, checked as boolean)}
                                            />
                                        </TableCell>
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
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="TODO">
                                                        <div className="flex items-center gap-2">
                                                            <CircleIcon className="h-3 w-3" />
                                                            To Do
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="IN_PROGRESS">
                                                        <div className="flex items-center gap-2">
                                                            <ClockIcon className="h-3 w-3" />
                                                            In Progress
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="COMPLETED">
                                                        <div className="flex items-center gap-2">
                                                            <CheckIcon className="h-3 w-3" />
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
                                            {task.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={task.assignedTo.image || undefined} />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(task.assignedTo.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{task.assignedTo.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Unassigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                <span className={`text-sm ${isOverdue ? "text-red-600" : deadlineInfo.color}`}>
                                                    {deadlineInfo.text}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm">{task.commentCount || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Paperclip className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm">{task.attachmentCount || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
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
                                                    <DropdownMenuItem onClick={() => onEdit(task)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(task)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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

// Helper icons
function ListTodoIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" />
        </svg>
    );
}

function CircleIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
        </svg>
    );
}

function ClockIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function CheckIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}