"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminTasksHeader } from "./AdminTasksHeader";
import { AdminTasksStats } from "./AdminTasksStats";
import { AdminTasksFilterBar } from "./AdminTasksFilterBar";
import { AdminTasksTable } from "./AdminTasksTable";
import { AdminTasksPagination } from "./AdminTasksPagination";

interface AdminTasksClientProps {
    initialTasks: any[];
    initialPagination: any;
    initialStats: any;
    projects: any[];
    users: any[];
    currentSearch: string;
    currentStatus: string;
    currentPriority: string;
    currentProjectId: string;
    currentAssignedTo: string;
    currentSortBy: string;
    currentPage: number;
}

export function AdminTasksClient({
    initialTasks,
    initialPagination,
    initialStats,
    projects,
    users,
    currentSearch,
    currentStatus,
    currentPriority,
    currentProjectId,
    currentAssignedTo,
    currentSortBy,
    currentPage,
}: AdminTasksClientProps) {
    const router = useRouter();

    const handleSearch = (
        search: string,
        status: string,
        priority: string,
        projectId: string,
        assignedTo: string,
        sortBy: string
    ) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        if (priority && priority !== "all") params.set("priority", priority);
        if (projectId && projectId !== "all") params.set("projectId", projectId);
        if (assignedTo && assignedTo !== "all") params.set("assignedTo", assignedTo);
        if (sortBy) params.set("sortBy", sortBy);
        params.set("page", "1");
        router.push(`/dashboard/tasks?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/tasks?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <AdminTasksHeader onRefresh={handleRefresh} />

            <AdminTasksStats stats={initialStats} />

            <AdminTasksFilterBar
                onSearch={handleSearch}
                projects={projects}
                users={users}
                currentSearch={currentSearch}
                currentStatus={currentStatus}
                currentPriority={currentPriority}
                currentProjectId={currentProjectId}
                currentAssignedTo={currentAssignedTo}
                currentSortBy={currentSortBy}
            />

            <AdminTasksTable
                tasks={initialTasks}
                onRefresh={handleRefresh}
            />

            {initialPagination && initialPagination.totalPages > 1 && (
                <AdminTasksPagination
                    currentPage={currentPage}
                    totalPages={initialPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}