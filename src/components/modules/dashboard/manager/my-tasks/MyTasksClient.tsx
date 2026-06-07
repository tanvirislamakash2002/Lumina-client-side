"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MyTasksHeader } from "./MyTasksHeader";
import { MyTasksStats } from "./MyTasksStats";
import { MyTasksFilterBar } from "./MyTasksFilterBar";
import { MyTasksTable } from "./MyTasksTable";
import { MyTasksPagination } from "./MyTasksPagination";

interface MyTasksClientProps {
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

export function MyTasksClient({
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
}: MyTasksClientProps) {
    const router = useRouter();
    const [tasks, setTasks] = useState(initialTasks);
    const [pagination, setPagination] = useState(initialPagination);
    const [stats, setStats] = useState(initialStats);

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
            <MyTasksHeader />

            <MyTasksStats stats={stats} />

            <MyTasksFilterBar
                onSearch={handleSearch}
                projects={projects}
                currentSearch={currentSearch}
                currentStatus={currentStatus}
                currentPriority={currentPriority}
                currentProjectId={currentProjectId}
                currentSortBy={currentSortBy}
            />

            <MyTasksTable
                tasks={tasks}
                onRefresh={handleRefresh}
            />

            {pagination && pagination.totalPages > 1 && (
                <MyTasksPagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}