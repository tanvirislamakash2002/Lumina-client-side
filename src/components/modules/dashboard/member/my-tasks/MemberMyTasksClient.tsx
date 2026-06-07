"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MemberMyTasksHeader } from "./MemberMyTasksHeader";
import { MemberMyTasksStats } from "./MemberMyTasksStats";
import { MemberMyTasksFilterBar } from "./MemberMyTasksFilterBar";
import { MemberMyTasksTable } from "./MemberMyTasksTable";
import { MemberMyTasksPagination } from "./MemberMyTasksPagination";

interface MemberMyTasksClientProps {
    initialTasks: any[];
    initialPagination: any;
    initialStats: any;
    projects: any[];
    currentSearch: string;
    currentStatus: string;
    currentPriority: string;
    currentProjectId: string;
    currentSortBy: string;
    currentPage: number;
}

export function MemberMyTasksClient({
    initialTasks,
    initialPagination,
    initialStats,
    projects,
    currentSearch,
    currentStatus,
    currentPriority,
    currentProjectId,
    currentSortBy,
    currentPage,
}: MemberMyTasksClientProps) {
    const router = useRouter();

    const handleSearch = (
        search: string,
        status: string,
        priority: string,
        projectId: string,
        sortBy: string
    ) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        if (priority && priority !== "all") params.set("priority", priority);
        if (projectId && projectId !== "all") params.set("projectId", projectId);
        if (sortBy) params.set("sortBy", sortBy);
        params.set("page", "1");
        router.push(`/dashboard/my-tasks?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/my-tasks?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <MemberMyTasksHeader />

            <MemberMyTasksStats stats={initialStats} />

            <MemberMyTasksFilterBar
                onSearch={handleSearch}
                projects={projects}
                currentSearch={currentSearch}
                currentStatus={currentStatus}
                currentPriority={currentPriority}
                currentProjectId={currentProjectId}
                currentSortBy={currentSortBy}
            />

            <MemberMyTasksTable
                tasks={initialTasks}
                onRefresh={handleRefresh}
            />

            {initialPagination && initialPagination.totalPages > 1 && (
                <MemberMyTasksPagination
                    currentPage={currentPage}
                    totalPages={initialPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}