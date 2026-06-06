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
import { Search, X, RefreshCw } from "lucide-react";

interface ManagerTasksFilterBarProps {
    onSearch: (
        search: string,
        status: string,
        priority: string,
        projectId: string,
        assignedTo: string,
        sortBy: string
    ) => void;
    projects: any[];
    members: any[];
    currentSearch: string;
    currentStatus: string;
    currentPriority: string;
    currentProjectId: string;
    currentAssignedTo: string;
    currentSortBy: string;
    selectedCount: number;
    onBulkStatusChange: () => void;
}

export function ManagerTasksFilterBar({
    onSearch,
    projects,
    members,
    currentSearch,
    currentStatus,
    currentPriority,
    currentProjectId,
    currentAssignedTo,
    currentSortBy,
    selectedCount,
    onBulkStatusChange,
}: ManagerTasksFilterBarProps) {
    const [search, setSearch] = useState(currentSearch);
    const [status, setStatus] = useState(currentStatus);
    const [priority, setPriority] = useState(currentPriority);
    const [projectId, setProjectId] = useState(currentProjectId);
    const [assignedTo, setAssignedTo] = useState(currentAssignedTo);
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
        const assignedChanged = assignedTo !== currentAssignedTo;
        const sortChanged = sortBy !== currentSortBy;

        if (searchChanged || statusChanged || priorityChanged || projectChanged || assignedChanged || sortChanged) {
            onSearch(debouncedSearch, status, priority, projectId, assignedTo, sortBy);
        }
    }, [debouncedSearch, status, priority, projectId, assignedTo, sortBy]);

    const handleClearFilters = () => {
        setSearch("");
        setStatus("all");
        setPriority("all");
        setProjectId("all");
        setAssignedTo("all");
        setSortBy("latest");
        onSearch("", "all", "all", "all", "all", "latest");
    };

    const hasActiveFilters = search !== "" ||
        status !== "all" ||
        priority !== "all" ||
        projectId !== "all" ||
        assignedTo !== "all" ||
        sortBy !== "latest";

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks by title or description..."
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
                                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
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

                        <Select value={assignedTo} onValueChange={setAssignedTo}>
                            <SelectTrigger className="w-full sm:w-56">
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

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={handleClearFilters}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear
                            </Button>
                        )}

                        {selectedCount > 0 && (
                            <Button
                                variant="outline"
                                onClick={onBulkStatusChange}
                                className="gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Update Status ({selectedCount})
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}