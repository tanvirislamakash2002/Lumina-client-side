"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import { AdminAuditHeader } from "./AdminAuditHeader";
import { AdminAuditStats } from "./AdminAuditStats";
import { AdminAuditFilterBar } from "./AdminAuditFilterBar";
import { AdminAuditTable } from "./AdminAuditTable";
import { AdminAuditPagination } from "./AdminAuditPagination";

interface AdminAuditClientProps {
    initialAuditLogs: any[];
    initialPagination: any;
    initialStats: any;
    currentAction: string;
    currentUserId: string;
    currentStatus: string;
    currentSearch: string;
    currentPage: number;
}

export function AdminAuditClient({
    initialAuditLogs,
    initialPagination,
    initialStats,
    currentAction,
    currentUserId,
    currentStatus,
    currentSearch,
    currentPage,
}: AdminAuditClientProps) {
    const router = useRouter();

    const handleSearch = (
        search: string,
        action: string,
        userId: string,
        status: string
    ) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (action && action !== "all") params.set("action", action);
        if (userId) params.set("userId", userId);
        if (status && status !== "all") params.set("status", status);
        params.set("page", "1");
        router.push(`/dashboard/admin/audit?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/admin/audit?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <AdminAuditHeader onRefresh={handleRefresh} />

            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                    Audit logs are immutable and cannot be deleted or modified. 
                    Retained for 7 years for compliance purposes.
                </AlertDescription>
            </Alert>

            <AdminAuditStats stats={initialStats} />

            <AdminAuditFilterBar
                onSearch={handleSearch}
                currentSearch={currentSearch}
                currentAction={currentAction}
                currentUserId={currentUserId}
                currentStatus={currentStatus}
            />

            <AdminAuditTable
                auditLogs={initialAuditLogs}
                onRefresh={handleRefresh}
            />

            {initialPagination && initialPagination.totalPages > 1 && (
                <AdminAuditPagination
                    currentPage={currentPage}
                    totalPages={initialPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}