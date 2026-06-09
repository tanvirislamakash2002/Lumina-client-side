"use client";

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
    projects: { id: string; name: string }[];  // Add this
    isAdmin: boolean;
    currentSearch: string;
    currentProjectId: string;  // Change from currentRole
    currentSort: string;  // Change from currentSort (keep but remove status/role)
    currentPage: number;
}

export function TeamClient({
    initialUsers,
    initialPagination,
    userStats,
    teamStats,
    projects,  // Add this
    isAdmin,
    currentSearch,
    currentProjectId,  // Change from currentRole
    currentSort,
    currentPage,
}: TeamClientProps) {
    const router = useRouter();

    const handleSearch = (search: string, projectId: string, sort: string) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (projectId && projectId !== "all") params.set("projectId", projectId);
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
            <TeamHeader 
            totalMembers={userStats?.totalUsers || 0} 
            isAdmin={isAdmin} 
            projects={projects}
            onRefresh={handleRefresh}
            />

            <TeamStats userStats={userStats} teamStats={teamStats} />

            <TeamFilterBar
                onSearch={handleSearch}
                projects={projects}
                currentSearch={currentSearch}
                currentProjectId={currentProjectId}
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