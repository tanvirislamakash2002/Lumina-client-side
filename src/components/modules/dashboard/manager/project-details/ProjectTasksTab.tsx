"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, User, AlertCircle, CheckCircle, PlayCircle, Circle, CheckSquare } from "lucide-react";
import { updateTaskStatus, deleteTask } from "@/actions/task.action";
import { toast } from "sonner";

interface ProjectTasksTabProps {
    projectId: string;
    initialTasks: any[];
    canEdit: boolean;
    members: any[];
    onTaskUpdate: () => void;
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

export function ProjectTasksTab({
    projectId,
    initialTasks,
    canEdit,
    members,
    onTaskUpdate,
}: ProjectTasksTabProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [assignedFilter, setAssignedFilter] = useState("all");
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        setUpdatingTaskId(taskId);
        try {
            const result = await updateTaskStatus(taskId, newStatus, projectId);
            if (result.success) {
                toast.success(`Task status updated`);
                onTaskUpdate();
            } else {
                toast.error(result.message || "Failed to update task status");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const handleDeleteTask = async (taskId: string, taskTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${taskTitle}"?`)) return;
        
        const result = await deleteTask(taskId, projectId);
        if (result.success) {
            toast.success("Task deleted successfully");
            onTaskUpdate();
        } else {
            toast.error(result.message || "Failed to delete task");
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
            (task.description?.toLowerCase().includes(search.toLowerCase()) || false);
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        const matchesAssigned = assignedFilter === "all" || task.assignedTo?.id === assignedFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
    });

    const getDaysUntil = (dueDate: string) => {
        const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (days < 0) return "Overdue";
        if (days === 0) return "Today";
        if (days === 1) return "Tomorrow";
        return `${days} days`;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Project Tasks</CardTitle>
                {canEdit && (
                    <Button asChild size="sm" className="gap-2">
                        <Link href={`/dashboard/tasks/create?projectId=${projectId}`}>
                            <Plus className="h-4 w-4" />
                            New Task
                        </Link>
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-36">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="TODO">To Do</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-full sm:w-36">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Assigned to" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Members</SelectItem>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {members.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                    {member.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Tasks Table */}
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="p-3 rounded-full bg-muted w-fit mx-auto mb-3">
                            <CheckSquare className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No tasks found</h3>
                        <p className="text-sm text-muted-foreground">
                            {search || statusFilter !== "all" || priorityFilter !== "all" || assignedFilter !== "all"
                                ? "Try adjusting your filters"
                                : canEdit
                                    ? "Create your first task to get started"
                                    : "No tasks have been created yet"}
                        </p>
                        {canEdit && !search && statusFilter === "all" && priorityFilter === "all" && assignedFilter === "all" && (
                            <Button asChild className="mt-4" size="sm">
                                <Link href={`/dashboard/tasks/create?projectId=${projectId}`}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Task
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <Link
                                                href={`/dashboard/tasks/${task.id}`}
                                                className="font-medium hover:text-indigo-600 transition-colors"
                                            >
                                                {task.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {canEdit ? (
                                                <Select
                                                    value={task.status}
                                                    onValueChange={(value) => handleStatusChange(task.id, value)}
                                                    disabled={updatingTaskId === task.id}
                                                >
                                                    <SelectTrigger className="w-32 h-8">
                                                        <SelectValue />
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
                                            ) : (
                                                <Badge className={statusColors[task.status]}>
                                                    {task.status.replace("_", " ")}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={priorityColors[task.priority]}>
                                                {task.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {task.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{task.assignedTo.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Unassigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                <span className={`text-sm ${new Date(task.dueDate) < new Date() && task.status !== "COMPLETED" ? "text-red-600" : ""}`}>
                                                    {getDaysUntil(task.dueDate)}
                                                </span>
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
                                                    {canEdit && (
                                                        <>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/dashboard/tasks/${task.id}/edit`}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteTask(task.id, task.title)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}