"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TeamHeader } from "./TeamHeader";
import { TeamStats } from "./TeamStats";
import { TeamFilterBar } from "./TeamFilterBar";
import { TeamMembersList } from "./TeamMembersList";
import { TeamPagination } from "./TeamPagination";

interface TeamClientProps {
    initialUsers: any[];
    initialPagination: any;
    userStats: any;
    teamStats: any;
    isAdmin: boolean;
    currentSearch: string;
    currentRole: string;
    currentStatus: string;
    currentSort: string;
    currentPage: number;
}

export function TeamClient({
    initialUsers,
    initialPagination,
    userStats,
    teamStats,
    isAdmin,
    currentSearch,
    currentRole,
    currentStatus,
    currentSort,
    currentPage,
}: TeamClientProps) {
    const router = useRouter();

    const handleSearch = (search: string, role: string, status: string, sort: string) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (role && role !== "all") params.set("role", role);
        if (status && status !== "all") params.set("status", status);
        if (sort) params.set("sort", sort);
        params.set("page", "1");
        router.push(`/dashboard/team?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/team?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <TeamHeader totalMembers={userStats?.totalUsers || 0} isAdmin={isAdmin} />

            <TeamStats userStats={userStats} teamStats={teamStats} />

            <TeamFilterBar
                onSearch={handleSearch}
                isAdmin={isAdmin}
                currentSearch={currentSearch}
                currentRole={currentRole}
                currentStatus={currentStatus}
                currentSort={currentSort}
            />

            <TeamMembersList
                users={initialUsers}
                isAdmin={isAdmin}
                onRefresh={handleRefresh}
            />

            {initialPagination && initialPagination.totalPages > 1 && (
                <TeamPagination
                    currentPage={currentPage}
                    totalPages={initialPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}