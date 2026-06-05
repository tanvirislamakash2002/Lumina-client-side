"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TasksHeader } from "./TasksHeader";
import { TasksStats } from "./TasksStats";
import { TasksFilters } from "./TasksFilters";
import { TasksTable } from "./TasksTable";
import { TasksPagination } from "./TasksPagination";

interface TasksClientProps {
    initialTasks: any;
    initialFilters: any;
    projects: any[];
    members: any[];
    userRole: string;
    currentUserId: string;
    currentPage: number;
    currentSearch?: string;
    currentStatus?: string;
    currentPriority?: string;
    currentProjectId?: string;
    currentAssignedTo?: string;
    currentSortBy?: string;
}

export function TasksClient({
    initialTasks,
    initialFilters,
    projects,
    members,
    userRole,
    currentUserId,
    currentPage,
    currentSearch,
    currentStatus,
    currentPriority,
    currentProjectId,
    currentAssignedTo,
    currentSortBy,
}: TasksClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState(currentSearch || "");
    const [status, setStatus] = useState(currentStatus || "all");
    const [priority, setPriority] = useState(currentPriority || "all");
    const [projectId, setProjectId] = useState(currentProjectId || "all");
    const [assignedTo, setAssignedTo] = useState(currentAssignedTo || "all");
    const [sortBy, setSortBy] = useState(currentSortBy || "latest");

    const tasks = initialTasks?.tasks || [];
    const stats = initialTasks?.stats || { total: 0, todo: 0, inProgress: 0, completed: 0, overdue: 0 };
    const pagination = initialTasks?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    const canCreate = userRole === "ADMIN" || userRole === "PROJECT_MANAGER";

    const updateFilters = (updates: Record<string, string>) => {
        const params = new URLSearchParams();

        const newSearch = updates.search !== undefined ? updates.search : search;
        const newStatus = updates.status !== undefined ? updates.status : status;
        const newPriority = updates.priority !== undefined ? updates.priority : priority;
        const newProjectId = updates.projectId !== undefined ? updates.projectId : projectId;
        const newAssignedTo = updates.assignedTo !== undefined ? updates.assignedTo : assignedTo;
        const newSortBy = updates.sortBy !== undefined ? updates.sortBy : sortBy;

        if (newSearch) params.set("search", newSearch);
        if (newStatus && newStatus !== "all") params.set("status", newStatus);
        if (newPriority && newPriority !== "all") params.set("priority", newPriority);
        if (newProjectId && newProjectId !== "all") params.set("projectId", newProjectId);
        if (newAssignedTo && newAssignedTo !== "all") params.set("assignedTo", newAssignedTo);
        if (newSortBy && newSortBy !== "latest") params.set("sortBy", newSortBy);
        params.set("page", "1");

        router.push(`/tasks?${params.toString()}`);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        updateFilters({ search: value });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        updateFilters({ status: value });
    };

    const handlePriorityChange = (value: string) => {
        setPriority(value);
        updateFilters({ priority: value });
    };

    const handleProjectChange = (value: string) => {
        setProjectId(value);
        updateFilters({ projectId: value });
    };

    const handleAssigneeChange = (value: string) => {
        setAssignedTo(value);
        updateFilters({ assignedTo: value });
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        updateFilters({ sortBy: value });
    };

    return (
        <div className="space-y-6">
            <TasksHeader canCreate={canCreate} />

            <TasksStats stats={stats} />

            <TasksFilters
                search={search}
                status={status}
                priority={priority}
                projectId={projectId}
                assignedTo={assignedTo}
                sortBy={sortBy}
                projects={projects}
                members={members}
                currentUserId={currentUserId}
                onSearchChange={handleSearch}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                onProjectChange={handleProjectChange}
                onAssigneeChange={handleAssigneeChange}
                onSortChange={handleSortChange}
                filters={initialFilters}
            />

            <TasksTable
                tasks={tasks}
                userRole={userRole}
                currentUserId={currentUserId}
            />

            {pagination.totalPages > 1 && (
                <TasksPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </div>
    );
}