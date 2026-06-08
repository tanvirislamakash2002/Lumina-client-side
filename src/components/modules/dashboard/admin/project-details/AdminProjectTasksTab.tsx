"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Calendar, Eye, Search, AlertCircle } from "lucide-react";

interface AdminProjectTasksTabProps {
    projectId: string;
    initialTasks: any[];
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
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
};

export function AdminProjectTasksTab({ projectId, initialTasks }: AdminProjectTasksTabProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [assignedFilter, setAssignedFilter] = useState("all");

    const filteredTasks = initialTasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        const matchesAssigned = assignedFilter === "all" || task.assignedTo?.id === assignedFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
    });

    // Get unique assignees for filter
    const assignees = [...new Map(initialTasks.filter(t => t.assignedTo).map(t => [t.assignedTo.id, t.assignedTo])).values()];

    if (initialTasks.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Project Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No tasks have been created in this project yet.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Tasks</CardTitle>
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
                            {assignees.map((assignee: any) => (
                                <SelectItem key={assignee.id} value={assignee.id}>
                                    {assignee.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Tasks Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Task Title</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Priority</TableHead>
                                <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTasks.map((task) => {
                                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";
                                return (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <Link
                                                href={`/dashboard/admin/tasks/${task.id}`}
                                                className="font-medium hover:text-indigo-600 transition-colors"
                                            >
                                                {task.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge className={statusColors[task.status]}>
                                                {task.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge className={priorityColors[task.priority]}>
                                                {task.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <Link
                                                href={`/dashboard/admin/users/${task.assignedTo?.id}`}
                                                className="text-sm hover:text-indigo-600 transition-colors"
                                            >
                                                {task.assignedTo?.name || "Unassigned"}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 whitespace-nowrap">
                                                <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                <span className={`text-sm ${isOverdue ? "text-red-600" : ""}`}>
                                                    {getDaysUntil(task.dueDate)}
                                                </span>
                                                {isOverdue && (
                                                    <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/admin/tasks/${task.id}`}>
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

                {filteredTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                        No tasks match your filters.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}