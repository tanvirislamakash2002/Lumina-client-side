"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminProjectsHeader } from "./AdminProjectsHeader";
import { AdminProjectsStats } from "./AdminProjectsStats";
import { AdminProjectsFilters } from "./AdminProjectsFilters";
import { AdminProjectsTable } from "./AdminProjectsTable";
import { AdminProjectsPagination } from "./AdminProjectsPagination";
import { BulkActionsBar } from "./BulkActionsBar";

interface AdminProjectsClientProps {
    initialData: any;
    currentPage: number;
    currentSearch?: string;
    currentStatus?: string;
    currentSort?: string;
}

export function AdminProjectsClient({
    initialData,
    currentPage,
    currentSearch,
    currentStatus,
    currentSort,
}: AdminProjectsClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState(currentSearch || "");
    const [status, setStatus] = useState(currentStatus || "all");
    const [sort, setSort] = useState(currentSort || "newest");
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

    const projects = initialData?.projects || [];
    const stats = initialData?.stats || {
        total: 0,
        active: 0,
        completed: 0,
        onHold: 0,
    };
    const pagination = initialData?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    const updateFilters = (updates: Record<string, string>) => {
        const params = new URLSearchParams();

        const newSearch = updates.search !== undefined ? updates.search : search;
        const newStatus = updates.status !== undefined ? updates.status : status;
        const newSort = updates.sort !== undefined ? updates.sort : sort;

        if (newSearch) params.set("search", newSearch);
        if (newStatus && newStatus !== "all") params.set("status", newStatus);
        if (newSort && newSort !== "newest") params.set("sort", newSort);
        params.set("page", "1");

        router.push(`/admin/projects?${params.toString()}`);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        updateFilters({ search: value });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        updateFilters({ status: value });
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        updateFilters({ sort: value });
    };

    const handleSelectAll = () => {
        if (selectedProjects.length === projects.length) {
            setSelectedProjects([]);
        } else {
            setSelectedProjects(projects.map((p: any) => p.id));
        }
    };

    const handleSelectProject = (projectId: string) => {
        setSelectedProjects((prev) =>
            prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
        );
    };

    const handleClearSelection = () => {
        setSelectedProjects([]);
    };

    return (
        <div className="space-y-6">
            <AdminProjectsHeader />

            <AdminProjectsStats stats={stats} />

            <AdminProjectsFilters
                search={search}
                status={status}
                sort={sort}
                onSearchChange={handleSearch}
                onStatusChange={handleStatusChange}
                onSortChange={handleSortChange}
            />

            {selectedProjects.length > 0 && (
                <BulkActionsBar
                    selectedCount={selectedProjects.length}
                    selectedProjects={selectedProjects}
                    onClearSelection={handleClearSelection}
                />
            )}

            <AdminProjectsTable
                projects={projects}
                selectedProjects={selectedProjects}
                onSelectProject={handleSelectProject}
                onSelectAll={handleSelectAll}
                allSelected={selectedProjects.length === projects.length && projects.length > 0}
            />

            {pagination.totalPages > 1 && (
                <AdminProjectsPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </div>
    );
}