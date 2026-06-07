"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface MyTasksFilterBarProps {
    onSearch: (
        search: string,
        status: string,
        priority: string,
        projectId: string,
        sortBy: string
    ) => void;
    projects: any[];
    currentSearch: string;
    currentStatus: string;
    currentPriority: string;
    currentProjectId: string;
    currentSortBy: string;
}

export function MyTasksFilterBar({
    onSearch,
    projects,
    currentSearch,
    currentStatus,
    currentPriority,
    currentProjectId,
    currentSortBy,
}: MyTasksFilterBarProps) {
    const [search, setSearch] = useState(currentSearch);
    const [status, setStatus] = useState(currentStatus);
    const [priority, setPriority] = useState(currentPriority);
    const [projectId, setProjectId] = useState(currentProjectId);
    const [sortBy, setSortBy] = useState(currentSortBy);
    const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);
    const initialRender = useRef(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const searchChanged = debouncedSearch !== currentSearch;
        const statusChanged = status !== currentStatus;
        const priorityChanged = priority !== currentPriority;
        const projectChanged = projectId !== currentProjectId;
        const sortChanged = sortBy !== currentSortBy;

        if (searchChanged || statusChanged || priorityChanged || projectChanged || sortChanged) {
            onSearch(debouncedSearch, status, priority, projectId, sortBy);
        }
    }, [debouncedSearch, status, priority, projectId, sortBy]);

    const handleClearFilters = () => {
        setSearch("");
        setStatus("all");
        setPriority("all");
        setProjectId("all");
        setSortBy("latest");
        onSearch("", "all", "all", "all", "latest");
    };

    const hasActiveFilters = search !== "" ||
        status !== "all" ||
        priority !== "all" ||
        projectId !== "all" ||
        sortBy !== "latest";

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search your tasks by title or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Select value={status} onValueChange={setStatus}>
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

                        <Select value={priority} onValueChange={setPriority}>
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

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latest">Latest Created</SelectItem>
                                <SelectItem value="oldest">Oldest Created</SelectItem>
                                <SelectItem value="deadline_asc">Nearest Deadline</SelectItem>
                                <SelectItem value="deadline_desc">Farthest Deadline</SelectItem>
                                <SelectItem value="priority_high">Priority (High to Low)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Select value={projectId} onValueChange={setProjectId}>
                            <SelectTrigger className="w-full sm:w-56">
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

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={handleClearFilters}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}