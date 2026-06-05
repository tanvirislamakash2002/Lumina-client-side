"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface TasksFiltersProps {
    search: string;
    status: string;
    priority: string;
    projectId: string;
    assignedTo: string;
    sortBy: string;
    projects: any[];
    members: any[];
    currentUserId: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onPriorityChange: (value: string) => void;
    onProjectChange: (value: string) => void;
    onAssigneeChange: (value: string) => void;
    onSortChange: (value: string) => void;
    filters: any;
}

export function TasksFilters({
    search,
    status,
    priority,
    projectId,
    assignedTo,
    sortBy,
    projects,
    members,
    currentUserId,
    onSearchChange,
    onStatusChange,
    onPriorityChange,
    onProjectChange,
    onAssigneeChange,
    onSortChange,
    filters,
}: TasksFiltersProps) {
    const statusOptions = filters?.statuses || [
        { value: "all", label: "All Status" },
        { value: "TODO", label: "To Do" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED", label: "Completed" },
    ];

    const priorityOptions = filters?.priorities || [
        { value: "all", label: "All Priority" },
        { value: "HIGH", label: "High" },
        { value: "MEDIUM", label: "Medium" },
        { value: "LOW", label: "Low" },
    ];

    const sortOptions = [
        { value: "latest", label: "Latest" },
        { value: "oldest", label: "Oldest" },
        { value: "deadline_asc", label: "Due Date (Earliest)" },
        { value: "deadline_desc", label: "Due Date (Latest)" },
        { value: "priority_high", label: "Priority (High to Low)" },
        { value: "title_asc", label: "Title (A-Z)" },
    ];

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-wrap gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={status} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((opt: any) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Priority Filter */}
                    <Select value={priority} onValueChange={onPriorityChange}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            {priorityOptions.map((opt: any) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Project Filter */}
                    <Select value={projectId} onValueChange={onProjectChange}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Assignee Filter */}
                    <Select value={assignedTo} onValueChange={onAssigneeChange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Assignees</SelectItem>
                            <SelectItem value="me">Assigned to Me</SelectItem>
                            {members.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                    {member.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sort By */}
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}