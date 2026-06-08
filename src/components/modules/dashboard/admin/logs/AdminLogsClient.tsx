"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLogsHeader } from "./AdminLogsHeader";
import { AdminLogsStats } from "./AdminLogsStats";
import { AdminLogsFilterBar } from "./AdminLogsFilterBar";
import { AdminLogsTable } from "./AdminLogsTable";
import { AdminLogsPagination } from "./AdminLogsPagination";

interface AdminLogsClientProps {
    initialLogs: any[];
    initialPagination: any;
    initialStats: any;
    currentSearch: string;
    currentLevel: string;
    currentPage: number;
}

export function AdminLogsClient({
    initialLogs,
    initialPagination,
    initialStats,
    currentSearch,
    currentLevel,
    currentPage,
}: AdminLogsClientProps) {
    const router = useRouter();

    const handleSearch = (search: string, level: string) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (level && level !== "all") params.set("level", level);
        params.set("page", "1");
        router.push(`/dashboard/admin/logs?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/admin/logs?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <AdminLogsHeader onRefresh={handleRefresh} />

            <AdminLogsStats stats={initialStats} />

            <AdminLogsFilterBar
                onSearch={handleSearch}
                currentSearch={currentSearch}
                currentLevel={currentLevel}
            />

            <AdminLogsTable
                logs={initialLogs}
                onRefresh={handleRefresh}
            />

            {initialPagination && initialPagination.totalPages > 1 && (
                <AdminLogsPagination
                    currentPage={currentPage}
                    totalPages={initialPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}