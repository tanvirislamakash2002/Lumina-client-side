"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogsHeader } from "./LogsHeader";
import { LogsFilters } from "./LogsFilters";
import { LogsTable } from "./LogsTable";
import { LogsPagination } from "./LogsPagination";

interface LogsClientProps {
    initialData: any;
    currentPage: number;
    currentLimit: number;
    currentLevel?: string;
    currentDays?: number;
    currentSearch?: string;
}

export function LogsClient({
    initialData,
    currentPage,
    currentLimit,
    currentLevel,
    currentDays,
    currentSearch,
}: LogsClientProps) {
    const router = useRouter();
    const [level, setLevel] = useState(currentLevel || "all");
    const [days, setDays] = useState(currentDays?.toString() || "7");
    const [search, setSearch] = useState(currentSearch || "");

    const logs = initialData?.logs || [];
    const pagination = initialData?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    const updateFilters = (updates: Record<string, string>) => {
        const params = new URLSearchParams();

        const newLevel = updates.level !== undefined ? updates.level : level;
        const newDays = updates.days !== undefined ? updates.days : days;
        const newSearch = updates.search !== undefined ? updates.search : search;

        if (newLevel && newLevel !== "all") params.set("level", newLevel);
        if (newDays && newDays !== "7") params.set("days", newDays);
        if (newSearch) params.set("search", newSearch);
        params.set("page", "1");
        params.set("limit", currentLimit.toString());

        router.push(`/admin/logs?${params.toString()}`);
    };

    const handleLevelChange = (value: string) => {
        setLevel(value);
        updateFilters({ level: value });
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
        setLevel("all");
        setDays("7");
        setSearch("");
        router.push("/admin/logs");
    };

    return (
        <div className="space-y-6">
            <LogsHeader />

            <LogsFilters
                level={level}
                days={days}
                search={search}
                onLevelChange={handleLevelChange}
                onDaysChange={handleDaysChange}
                onSearchChange={handleSearch}
                onClearFilters={handleClearFilters}
            />

            <LogsTable logs={logs} />

            {pagination.totalPages > 1 && (
                <LogsPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </div>
    );
}