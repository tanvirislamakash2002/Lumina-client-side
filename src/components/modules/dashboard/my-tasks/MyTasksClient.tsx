"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MyTasksHeader } from "./MyTasksHeader";
import { MyTasksStats } from "./MyTasksStats";
import { MyTasksFilters } from "./MyTasksFilters";
import { MyTasksTable } from "./MyTasksTable";
import { MyTasksPagination } from "./MyTasksPagination";

interface MyTasksClientProps {
    initialTasks: any;
    projects: any[];
    currentUserId: string;
    currentPage: number;
    currentSearch?: string;
    currentStatus?: string;
    currentProjectId?: string;
    currentSortBy?: string;
}

export function MyTasksClient({
    initialTasks,
    projects,
    currentUserId,
    currentPage,
    currentSearch,
    currentStatus,
    currentProjectId,
    currentSortBy,
}: MyTasksClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState(currentSearch || "");
    const [status, setStatus] = useState(currentStatus || "all");
    const [projectId, setProjectId] = useState(currentProjectId || "all");
    const [sortBy, setSortBy] = useState(currentSortBy || "latest");

    const tasks = initialTasks?.tasks || [];
    const stats = initialTasks?.stats || { total: 0, todo: 0, inProgress: 0, completed: 0, overdue: 0 };
    const pagination = initialTasks?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    const updateFilters = (updates: Record<string, string>) => {
        const params = new URLSearchParams();

        const newSearch = updates.search !== undefined ? updates.search : search;
        const newStatus = updates.status !== undefined ? updates.status : status;
        const newProjectId = updates.projectId !== undefined ? updates.projectId : projectId;
        const newSortBy = updates.sortBy !== undefined ? updates.sortBy : sortBy;

        if (newSearch) params.set("search", newSearch);
        if (newStatus && newStatus !== "all") params.set("status", newStatus);
        if (newProjectId && newProjectId !== "all") params.set("projectId", newProjectId);
        if (newSortBy && newSortBy !== "latest") params.set("sortBy", newSortBy);
        params.set("page", "1");

        router.push(`/my-tasks?${params.toString()}`);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        updateFilters({ search: value });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        updateFilters({ status: value });
    };

    const handleProjectChange = (value: string) => {
        setProjectId(value);
        updateFilters({ projectId: value });
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        updateFilters({ sortBy: value });
    };

    return (
        <div className="space-y-6">
            <MyTasksHeader />

            <MyTasksStats stats={stats} />

            <MyTasksFilters
                search={search}
                status={status}
                projectId={projectId}
                sortBy={sortBy}
                projects={projects}
                onSearchChange={handleSearch}
                onStatusChange={handleStatusChange}
                onProjectChange={handleProjectChange}
                onSortChange={handleSortChange}
            />

            <MyTasksTable
                tasks={tasks}
                currentUserId={currentUserId}
            />

            {pagination.totalPages > 1 && (
                <MyTasksPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </div>
    );
}