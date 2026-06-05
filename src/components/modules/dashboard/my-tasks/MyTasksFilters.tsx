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

interface MyTasksFiltersProps {
    search: string;
    status: string;
    projectId: string;
    sortBy: string;
    projects: any[];
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onProjectChange: (value: string) => void;
    onSortChange: (value: string) => void;
}

export function MyTasksFilters({
    search,
    status,
    projectId,
    sortBy,
    projects,
    onSearchChange,
    onStatusChange,
    onProjectChange,
    onSortChange,
}: MyTasksFiltersProps) {
    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "TODO", label: "To Do" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED", label: "Completed" },
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
                            placeholder="Search my tasks..."
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
                            {statusOptions.map((opt) => (
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