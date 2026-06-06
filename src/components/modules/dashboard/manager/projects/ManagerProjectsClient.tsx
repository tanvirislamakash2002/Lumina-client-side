"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ManagerProjectsHeader } from "./ManagerProjectsHeader";
import { ManagerProjectStats } from "./ManagerProjectStats";
import { ManagerProjectsFilterBar } from "./ManagerProjectsFilterBar";
import { ManagerProjectsTable } from "./ManagerProjectsTable";
import { ManagerProjectsPagination } from "./ManagerProjectsPagination";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { BulkDeleteDialog } from "./BulkDeleteDialog";

interface ManagerProjectsClientProps {
    initialProjects: any[];
    initialPagination: any;
    initialStats: any;
    members: any[];
    currentSearch: string;
    currentStatus: string;
    currentSortBy: string;
    currentPage: number;
}

export function ManagerProjectsClient({
    initialProjects,
    initialPagination,
    initialStats,
    members,
    currentSearch,
    currentStatus,
    currentSortBy,
    currentPage,
}: ManagerProjectsClientProps) {
    const router = useRouter();
    const [projects, setProjects] = useState(initialProjects);
    const [pagination, setPagination] = useState(initialPagination);
    const [stats, setStats] = useState(initialStats);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<any>(null);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

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

    const handleDeleteSuccess = () => {
        router.refresh();
    };

    const handleBulkDelete = () => {
        if (selectedProjects.length > 0) {
            setBulkDeleteDialogOpen(true);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProjects(projects.map((p) => p.id));
        } else {
            setSelectedProjects([]);
        }
    };

    const handleSelectProject = (projectId: string, checked: boolean) => {
        if (checked) {
            setSelectedProjects([...selectedProjects, projectId]);
        } else {
            setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
        }
    };

    return (
        <div className="space-y-6">
            <ManagerProjectsHeader />

            <ManagerProjectStats stats={stats} />

            <ManagerProjectsFilterBar
                onSearch={handleSearch}
                currentSearch={currentSearch}
                currentStatus={currentStatus}
                currentSortBy={currentSortBy}
                selectedCount={selectedProjects.length}
                onBulkDelete={handleBulkDelete}
            />

            <ManagerProjectsTable
                projects={projects}
                selectedProjects={selectedProjects}
                onSelectAll={handleSelectAll}
                onSelectProject={handleSelectProject}
                onEdit={(project) => router.push(`/dashboard/projects/${project.id}/edit`)}
                onDelete={(project) => {
                    setProjectToDelete(project);
                    setDeleteDialogOpen(true);
                }}
            />

            {pagination && pagination.totalPages > 1 && (
                <ManagerProjectsPagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <DeleteProjectDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                project={projectToDelete}
                onSuccess={handleDeleteSuccess}
            />

            <BulkDeleteDialog
                open={bulkDeleteDialogOpen}
                onOpenChange={setBulkDeleteDialogOpen}
                projectIds={selectedProjects}
                onSuccess={() => {
                    setSelectedProjects([]);
                    router.refresh();
                }}
            />
        </div>
    );
}