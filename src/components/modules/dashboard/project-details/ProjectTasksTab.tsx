"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Calendar, User } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProjectTasksTabProps {
    tasks: any;
    projectId: string;
    canEdit: boolean;
    userRole: string;
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

export function ProjectTasksTab({ tasks, projectId, canEdit, userRole }: ProjectTasksTabProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const taskList = tasks?.tasks || [];
    const filteredTasks = taskList.filter((task: any) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    if (taskList.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Tasks</CardTitle>
                    {canEdit && (
                        <Button asChild size="sm">
                            <Link href={`/tasks/create?projectId=${projectId}`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Task
                            </Link>
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        No tasks yet. Create your first task to get started.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                <CardTitle>Tasks</CardTitle>
                {canEdit && (
                    <Button asChild size="sm">
                        <Link href={`/tasks/create?projectId=${projectId}`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Task
                        </Link>
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px]">
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
                        <SelectTrigger className="w-[130px]">
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

                {/* Task List */}
                <div className="space-y-3">
                    {filteredTasks.map((task: any) => (
                        <Link href={`/tasks/${task.id}`} key={task.id} className="block">
                            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-medium hover:text-indigo-600 transition-colors">
                                            {task.title}
                                        </h4>
                                        <Badge className={priorityColors[task.priority]}>
                                            {task.priority}
                                        </Badge>
                                        <Badge className={statusColors[task.status]}>
                                            {task.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                    {task.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                            {task.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    {task.assignedTo && (
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            <span>{task.assignedTo.name}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredTasks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                        No tasks match your filters.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}