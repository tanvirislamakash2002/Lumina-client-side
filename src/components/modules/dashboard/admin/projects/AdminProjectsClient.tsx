"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminProjectsHeader } from "./AdminProjectsHeader";
import { AdminProjectsStats } from "./AdminProjectsStats";
import { AdminProjectsFilterBar } from "./AdminProjectsFilterBar";
import { AdminProjectsTable } from "./AdminProjectsTable";
import { AdminProjectsPagination } from "./AdminProjectsPagination";

interface AdminProjectsClientProps {
    initialProjects: any[];
    initialPagination: any;
    initialStats: any;
    currentSearch: string;
    currentStatus: string;
    currentSort: string;
    currentPage: number;
}

export function AdminProjectsClient({
    initialProjects,
    initialPagination,
    initialStats,
    currentSearch,
    currentStatus,
    currentSort,
    currentPage,
}: AdminProjectsClientProps) {
    const router = useRouter();

    const handleSearch = (search: string, status: string, sort: string) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        if (sort) params.set("sort", sort);
        params.set("page", "1");
        router.push(`/dashboard/projects?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/projects?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <AdminProjectsHeader onRefresh={handleRefresh} />

            <AdminProjectsStats stats={initialStats} />

            <AdminProjectsFilterBar
                onSearch={handleSearch}
                currentSearch={currentSearch}
                currentStatus={currentStatus}
                currentSort={currentSort}
            />

            <AdminProjectsTable
                projects={initialProjects}
                onRefresh={handleRefresh}
            />

            {initialPagination && initialPagination.totalPages > 1 && (
                <AdminProjectsPagination
                    currentPage={currentPage}
                    totalPages={initialPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}