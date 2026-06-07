"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MemberProjectsHeader } from "./MemberProjectsHeader";
import { MemberProjectsStats } from "./MemberProjectsStats";
import { MemberProjectsFilterBar } from "./MemberProjectsFilterBar";
import { MemberProjectsGrid } from "./MemberProjectsGrid";
import { MemberProjectsPagination } from "./MemberProjectsPagination";

interface MemberProjectsClientProps {
    initialProjects: any[];
    initialPagination: any;
    initialStats: any;
    currentUser: any;
    currentSearch: string;
    currentStatus: string;
    currentSortBy: string;
    currentPage: number;
}

export function MemberProjectsClient({
    initialProjects,
    initialPagination,
    initialStats,
    currentUser,
    currentSearch,
    currentStatus,
    currentSortBy,
    currentPage,
}: MemberProjectsClientProps) {
    const router = useRouter();

    const handleSearch = (search: string, status: string, sortBy: string) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        if (sortBy) params.set("sortBy", sortBy);
        params.set("page", "1");
        router.push(`/dashboard/projects?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/projects?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <MemberProjectsHeader />

            <MemberProjectsStats stats={initialStats} />

            <MemberProjectsFilterBar
                onSearch={handleSearch}
                currentSearch={currentSearch}
                currentStatus={currentStatus}
                currentSortBy={currentSortBy}
            />

            <MemberProjectsGrid
                projects={initialProjects}
                currentUser={currentUser}
            />

            {initialPagination && initialPagination.totalPages > 1 && (
                <MemberProjectsPagination
                    currentPage={currentPage}
                    totalPages={initialPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}