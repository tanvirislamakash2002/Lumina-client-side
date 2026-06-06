"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ManagerTasksHeader } from "./ManagerTasksHeader";
import { ManagerTasksStats } from "./ManagerTasksStats";
import { ManagerTasksFilterBar } from "./ManagerTasksFilterBar";
import { ManagerTasksTable } from "./ManagerTasksTable";
import { ManagerTasksPagination } from "./ManagerTasksPagination";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { BulkStatusDialog } from "./BulkStatusDialog";

interface ManagerTasksClientProps {
    initialTasks: any[];
    initialPagination: any;
    initialStats: any;
    projects: any[];
    members: any[];
    currentSearch: string;
    currentStatus: string;
    currentPriority: string;
    currentProjectId: string;
    currentAssignedTo: string;
    currentSortBy: string;
    currentPage: number;
}

export function ManagerTasksClient({
    initialTasks,
    initialPagination,
    initialStats,
    projects,
    members,
    currentSearch,
    currentStatus,
    currentPriority,
    currentProjectId,
    currentAssignedTo,
    currentSortBy,
    currentPage,
}: ManagerTasksClientProps) {
    const router = useRouter();
    const [tasks, setTasks] = useState(initialTasks);
    const [pagination, setPagination] = useState(initialPagination);
    const [stats, setStats] = useState(initialStats);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<any>(null);
    const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false);

    const handleSearch = (
        search: string,
        status: string,
        priority: string,
        projectId: string,
        assignedTo: string,
        sortBy: string
    ) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        if (priority && priority !== "all") params.set("priority", priority);
        if (projectId && projectId !== "all") params.set("projectId", projectId);
        if (assignedTo && assignedTo !== "all") params.set("assignedTo", assignedTo);
        if (sortBy) params.set("sortBy", sortBy);
        params.set("page", "1");
        router.push(`/dashboard/tasks?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/tasks?${params.toString()}`);
    };

    const handleDeleteSuccess = () => {
        router.refresh();
    };

    const handleBulkStatusChange = () => {
        if (selectedTasks.length > 0) {
            setBulkStatusDialogOpen(true);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTasks(tasks.map((t) => t.id));
        } else {
            setSelectedTasks([]);
        }
    };

    const handleSelectTask = (taskId: string, checked: boolean) => {
        if (checked) {
            setSelectedTasks([...selectedTasks, taskId]);
        } else {
            setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
        }
    };

    return (
        <div className="space-y-6">
            <ManagerTasksHeader />

            <ManagerTasksStats stats={stats} />

            <ManagerTasksFilterBar
                onSearch={handleSearch}
                projects={projects}
                members={members}
                currentSearch={currentSearch}
                currentStatus={currentStatus}
                currentPriority={currentPriority}
                currentProjectId={currentProjectId}
                currentAssignedTo={currentAssignedTo}
                currentSortBy={currentSortBy}
                selectedCount={selectedTasks.length}
                onBulkStatusChange={handleBulkStatusChange}
            />

            <ManagerTasksTable
                tasks={tasks}
                selectedTasks={selectedTasks}
                onSelectAll={handleSelectAll}
                onSelectTask={handleSelectTask}
                onEdit={(task) => router.push(`/dashboard/tasks/${task.id}/edit`)}
                onDelete={(task) => {
                    setTaskToDelete(task);
                    setDeleteDialogOpen(true);
                }}
                onRefresh={router.refresh}
            />

            {pagination && pagination.totalPages > 1 && (
                <ManagerTasksPagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <DeleteTaskDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                task={taskToDelete}
                onSuccess={handleDeleteSuccess}
            />

            <BulkStatusDialog
                open={bulkStatusDialogOpen}
                onOpenChange={setBulkStatusDialogOpen}
                taskIds={selectedTasks}
                onSuccess={() => {
                    setSelectedTasks([]);
                    router.refresh();
                }}
            />
        </div>
    );
}