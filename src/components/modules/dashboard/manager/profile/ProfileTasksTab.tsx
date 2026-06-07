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

interface ProfileTasksTabProps {
    userId: string;
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

export function ProfileTasksTab({ userId, initialTasks }: ProfileTasksTabProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    if (tasks.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No tasks assigned to you yet.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Tasks</CardTitle>
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
                </div>

                {/* Tasks Table - ADDED responsive wrapper */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Task Title</TableHead>
                                <TableHead className="hidden sm:table-cell">Project</TableHead>  {/* Hide on mobile */}
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Priority</TableHead>  {/* Hide on tablet */}
                                <TableHead>Due Date</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTasks.map((task) => {
                                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";
                                return (
                                    <TableRow key={task.id}>
                                        <TableCell className="max-w-[200px]">
                                            <Link
                                                href={`/dashboard/tasks/${task.id}`}
                                                className="font-medium hover:text-indigo-600 transition-colors line-clamp-2"
                                            >
                                                {task.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Link
                                                href={`/dashboard/projects/${task.project?.id}`}
                                                className="text-sm hover:text-indigo-600 transition-colors line-clamp-1"
                                            >
                                                {task.project?.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[task.status]}>
                                                {task.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge className={priorityColors[task.priority]}>
                                                {task.priority}
                                            </Badge>
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

                {filteredTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                        No tasks match your filters.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}