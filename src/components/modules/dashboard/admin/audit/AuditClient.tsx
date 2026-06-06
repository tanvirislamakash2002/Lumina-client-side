"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuditHeader } from "./AuditHeader";
import { AuditStats } from "./AuditStats";
import { AuditFilters } from "./AuditFilters";
import { AuditTable } from "./AuditTable";
import { AuditPagination } from "./AuditPagination";

interface AuditClientProps {
    initialData: any;
    users: any[];
    currentPage: number;
    currentLimit: number;
    currentUserId?: string;
    currentAction?: string;
    currentDays?: number;
    currentSearch?: string;
}

export function AuditClient({
    initialData,
    users,
    currentPage,
    currentLimit,
    currentUserId,
    currentAction,
    currentDays,
    currentSearch,
}: AuditClientProps) {
    const router = useRouter();
    const [userId, setUserId] = useState(currentUserId || "all");
    const [action, setAction] = useState(currentAction || "all");
    const [days, setDays] = useState(currentDays?.toString() || "30");
    const [search, setSearch] = useState(currentSearch || "");

    const activities = initialData?.activities || [];
    const pagination = initialData?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    // Calculate stats
    const uniqueUsers = new Set(activities.map((a: any) => a.user?.id)).size;
    const actionCounts: Record<string, number> = {};
    activities.forEach((a: any) => {
        actionCounts[a.action] = (actionCounts[a.action] || 0) + 1;
    });
    const mostCommonAction = Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    const todayActivities = activities.filter((a: any) => {
        const today = new Date().toDateString();
        return new Date(a.createdAt).toDateString() === today;
    }).length;

    const stats = {
        totalActions: pagination.totalItems,
        uniqueUsers,
        mostCommonAction,
        actionsToday: todayActivities,
    };

    const updateFilters = (updates: Record<string, string>) => {
        const params = new URLSearchParams();

        const newUserId = updates.userId !== undefined ? updates.userId : userId;
        const newAction = updates.action !== undefined ? updates.action : action;
        const newDays = updates.days !== undefined ? updates.days : days;
        const newSearch = updates.search !== undefined ? updates.search : search;

        if (newUserId && newUserId !== "all") params.set("userId", newUserId);
        if (newAction && newAction !== "all") params.set("action", newAction);
        if (newDays && newDays !== "30") params.set("days", newDays);
        if (newSearch) params.set("search", newSearch);
        params.set("page", "1");
        params.set("limit", currentLimit.toString());

        router.push(`/admin/audit?${params.toString()}`);
    };

    const handleUserChange = (value: string) => {
        setUserId(value);
        updateFilters({ userId: value });
    };

    const handleActionChange = (value: string) => {
        setAction(value);
        updateFilters({ action: value });
    };

    const handleDaysChange = (value: string) => {
        setDays(value);
        updateFilters({ days: value });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        updateFilters({ search: value });
    };

    const handleClearFilters = () => {
        setUserId("all");
        setAction("all");
        setDays("30");
        setSearch("");
        router.push("/admin/audit");
    };

    return (
        <div className="space-y-6">
            <AuditHeader />

            <AuditStats stats={stats} />

            <AuditFilters
                userId={userId}
                action={action}
                days={days}
                search={search}
                users={users}
                onUserChange={handleUserChange}
                onActionChange={handleActionChange}
                onDaysChange={handleDaysChange}
                onSearchChange={handleSearch}
                onClearFilters={handleClearFilters}
            />

            <AuditTable activities={activities} />

            {pagination.totalPages > 1 && (
                <AuditPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </div>
    );
}