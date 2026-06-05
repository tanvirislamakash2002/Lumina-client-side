"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectsFilters } from "./ProjectsFilters";
import { ProjectsStats } from "./ProjectsStats";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsPagination } from "./ProjectsPagination";

interface ProjectsClientProps {
    initialProjects: any;
    initialFilters: any;
    currentPage: number;
    currentSearch?: string;
    currentStatus?: string;
    currentSortBy?: string;
    userRole: string;
}

export function ProjectsClient({
    initialProjects,
    initialFilters,
    currentPage,
    currentSearch,
    currentStatus,
    currentSortBy,
    userRole,
}: ProjectsClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState(currentSearch || "");
    const [status, setStatus] = useState(currentStatus || "all");
    const [sortBy, setSortBy] = useState(currentSortBy || "latest");

    const canCreateProject = userRole === "ADMIN" || userRole === "PROJECT_MANAGER";

    const handleSearch = (value: string) => {
        setSearch(value);
        updateFilters({ search: value });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        updateFilters({ status: value });
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        updateFilters({ sortBy: value });
    };

    const updateFilters = (updates: Record<string, string>) => {
        const params = new URLSearchParams();
        
        const newSearch = updates.search !== undefined ? updates.search : search;
        const newStatus = updates.status !== undefined ? updates.status : status;
        const newSortBy = updates.sortBy !== undefined ? updates.sortBy : sortBy;
        
        if (newSearch) params.set("search", newSearch);
        if (newStatus && newStatus !== "all") params.set("status", newStatus);
        if (newSortBy && newSortBy !== "latest") params.set("sortBy", newSortBy);
        params.set("page", "1");
        
        router.push(`/projects?${params.toString()}`);
    };

    const projects = initialProjects?.projects || [];
    const stats = initialProjects?.stats || { total: 0, active: 0, completed: 0, onHold: 0 };
    const pagination = initialProjects?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    return (
        <div className="space-y-6">
            <ProjectsHeader canCreateProject={canCreateProject} />
            
            <ProjectsFilters
                search={search}
                status={status}
                sortBy={sortBy}
                onSearchChange={handleSearch}
                onStatusChange={handleStatusChange}
                onSortChange={handleSortChange}
                filters={initialFilters}
            />
            
            <ProjectsStats stats={stats} />
            
            <ProjectsGrid projects={projects} userRole={userRole} />
            
            {pagination.totalPages > 1 && (
                <ProjectsPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </div>
    );
}