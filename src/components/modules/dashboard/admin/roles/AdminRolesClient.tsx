"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { AdminRolesHeader } from "./AdminRolesHeader";
import { AdminRolesStats } from "./AdminRolesStats";
import { AdminRolesFilterBar } from "./AdminRolesFilterBar";
import { AdminRolesTable } from "./AdminRolesTable";
import { AdminRolesPagination } from "./AdminRolesPagination";
import { AdminRolesAuditLog } from "./AdminRolesAuditLog";

interface AdminRolesClientProps {
    initialUsers: any[];
    initialPagination: any;
    initialStats: any;
    auditLog: any[];
    auditPagination: any;
    currentUserId: string;
    isSuperAdmin: boolean;
    currentSearch: string;
    currentRoleFilter: string;
    currentStatusFilter: string;
    currentPage: number;
    currentAuditPage: number;
}

export function AdminRolesClient({
    initialUsers,
    initialPagination,
    initialStats,
    auditLog,
    auditPagination,
    currentUserId,
    isSuperAdmin,
    currentSearch,
    currentRoleFilter,
    currentStatusFilter,
    currentPage,
    currentAuditPage,
}: AdminRolesClientProps) {
    const router = useRouter();
    const [showAudit, setShowAudit] = useState(false);

    const handleSearch = (search: string, role: string, status: string) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (role && role !== "all") params.set("role", role);
        if (status && status !== "all") params.set("status", status);
        params.set("page", "1");
        router.push(`/dashboard/roles?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/dashboard/roles?${params.toString()}`);
    };

    const handleAuditPageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("auditPage", page.toString());
        router.push(`/dashboard/roles?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    // Check if multiple admins exist
    const adminCount = initialStats?.adminCount || 0;
    const showAdminWarning = adminCount === 1;
console.log(initialStats,'------');
    return (
        <div className="space-y-6">
            <AdminRolesHeader onRefresh={handleRefresh} />

            {showAdminWarning && (
                <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                        You are the only administrator. It's recommended to have at least one backup administrator.
                        Contact support to create additional admin accounts.
                    </AlertDescription>
                </Alert>
            )}

            <AdminRolesStats stats={initialStats} />

            <AdminRolesFilterBar
                onSearch={handleSearch}
                currentSearch={currentSearch}
                currentRole={currentRoleFilter}
                currentStatus={currentStatusFilter}
            />

            <AdminRolesTable
                users={initialUsers}
                currentUserId={currentUserId}
                isSuperAdmin={isSuperAdmin}
                onRefresh={handleRefresh}
            />

            {initialPagination && initialPagination.totalPages > 1 && (
                <AdminRolesPagination
                    currentPage={currentPage}
                    totalPages={initialPagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <AdminRolesAuditLog
                auditLog={auditLog}
                pagination={auditPagination}
                currentPage={currentAuditPage}
                onPageChange={handleAuditPageChange}
                isVisible={showAudit}
                onToggleVisibility={() => setShowAudit(!showAudit)}
            />
        </div>
    );
}