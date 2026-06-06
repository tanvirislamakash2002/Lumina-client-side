"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsersHeader } from "./UsersHeader";
import { UsersStats } from "./UsersStats";
import { UsersFilters } from "./UsersFilters";
import { UsersTable } from "./UsersTable";
import { UsersPagination } from "./UsersPagination";
import { BulkActionsBar } from "./BulkActionsBar";

interface UsersClientProps {
    initialData: any;
    currentUserId: string;
    currentPage: number;
    currentSearch?: string;
    currentRole?: string;
    currentStatus?: string;
    currentVerified?: string;
    currentSort?: string;
}

export function UsersClient({
    initialData,
    currentUserId,
    currentPage,
    currentSearch,
    currentRole,
    currentStatus,
    currentVerified,
    currentSort,
}: UsersClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState(currentSearch || "");
    const [role, setRole] = useState(currentRole || "all");
    const [status, setStatus] = useState(currentStatus || "all");
    const [verified, setVerified] = useState(currentVerified || "all");
    const [sort, setSort] = useState(currentSort || "newest");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const users = initialData?.users || [];
    const stats = initialData?.stats || {
        totalUsers: 0,
        adminCount: 0,
        projectManagerCount: 0,
        teamMemberCount: 0,
        activeUsers: 0,
    };
    const pagination = initialData?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    const updateFilters = (updates: Record<string, string>) => {
        const params = new URLSearchParams();

        const newSearch = updates.search !== undefined ? updates.search : search;
        const newRole = updates.role !== undefined ? updates.role : role;
        const newStatus = updates.status !== undefined ? updates.status : status;
        const newVerified = updates.verified !== undefined ? updates.verified : verified;
        const newSort = updates.sort !== undefined ? updates.sort : sort;

        if (newSearch) params.set("search", newSearch);
        if (newRole && newRole !== "all") params.set("role", newRole);
        if (newStatus && newStatus !== "all") params.set("status", newStatus);
        if (newVerified && newVerified !== "all") params.set("verified", newVerified);
        if (newSort && newSort !== "newest") params.set("sort", newSort);
        params.set("page", "1");

        router.push(`/admin/users?${params.toString()}`);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        updateFilters({ search: value });
    };

    const handleRoleChange = (value: string) => {
        setRole(value);
        updateFilters({ role: value });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        updateFilters({ status: value });
    };

    const handleVerifiedChange = (value: string) => {
        setVerified(value);
        updateFilters({ verified: value });
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        updateFilters({ sort: value });
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map((u: any) => u.id));
        }
    };

    const handleSelectUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleClearSelection = () => {
        setSelectedUsers([]);
    };

    return (
        <div className="space-y-6">
            <UsersHeader />

            <UsersStats stats={stats} />

            <UsersFilters
                search={search}
                role={role}
                status={status}
                verified={verified}
                sort={sort}
                onSearchChange={handleSearch}
                onRoleChange={handleRoleChange}
                onStatusChange={handleStatusChange}
                onVerifiedChange={handleVerifiedChange}
                onSortChange={handleSortChange}
            />

            {selectedUsers.length > 0 && (
                <BulkActionsBar
                    selectedCount={selectedUsers.length}
                    selectedUsers={selectedUsers}
                    onClearSelection={handleClearSelection}
                />
            )}

            <UsersTable
                users={users}
                currentUserId={currentUserId}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
                allSelected={selectedUsers.length === users.length && users.length > 0}
            />

            {pagination.totalPages > 1 && (
                <UsersPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </div>
    );
}