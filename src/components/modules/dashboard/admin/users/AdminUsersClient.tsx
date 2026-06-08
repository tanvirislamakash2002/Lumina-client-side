"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminUsersHeader } from "./AdminUsersHeader";
import { AdminUsersStats } from "./AdminUsersStats";
import { AdminUsersFilterBar } from "./AdminUsersFilterBar";
import { AdminUsersTable } from "./AdminUsersTable";
import { AdminUsersPagination } from "./AdminUsersPagination";
import { InviteUserDialog } from "./InviteUserDialog";

interface AdminUsersClientProps {
    initialUsers: any[];
    initialPagination: any;
    initialStats: any;
    currentUserId: string;
    currentSearch: string;
    currentRole: string;
    currentStatus: string;
    currentVerified: string;
    currentSort: string;
    currentPage: number;
}

export function AdminUsersClient({
    initialUsers,
    initialPagination,
    initialStats,
    currentUserId,
    currentSearch,
    currentRole,
    currentStatus,
    currentVerified,
    currentSort,
    currentPage,
}: AdminUsersClientProps) {
    const router = useRouter();
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    const handleSearch = (
        search: string,
        role: string,
        status: string,
        verified: string,
        sort: string
    ) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (role && role !== "all") params.set("role", role);
        if (status && status !== "all") params.set("status", status);
        if (verified && verified !== "all") params.set("verified", verified);
        if (sort) params.set("sort", sort);
        params.set("page", "1");
        router.push(`/dashboard/users?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/users?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <AdminUsersHeader onInvite={() => setInviteDialogOpen(true)} />

            <AdminUsersStats stats={initialStats} />

            <AdminUsersFilterBar
                onSearch={handleSearch}
                currentSearch={currentSearch}
                currentRole={currentRole}
                currentStatus={currentStatus}
                currentVerified={currentVerified}
                currentSort={currentSort}
            />

            <AdminUsersTable
                users={initialUsers}
                currentUserId={currentUserId}
                onRefresh={handleRefresh}
            />

            {initialPagination && initialPagination.totalPages > 1 && (
                <AdminUsersPagination
                    currentPage={currentPage}
                    totalPages={initialPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <InviteUserDialog
                open={inviteDialogOpen}
                onOpenChange={setInviteDialogOpen}
                onSuccess={handleRefresh}
            />
        </div>
    );
}