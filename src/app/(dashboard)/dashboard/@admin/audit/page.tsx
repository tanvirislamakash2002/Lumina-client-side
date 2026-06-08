import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getAuditStats, getAuditTrail } from "@/actions/admin.action";
import { AdminAuditClient } from "@/components/modules/dashboard/admin/audit/AdminAuditClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        action?: string;
        userId?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
        search?: string;
    }>;
}

export default async function AdminAuditPage({ searchParams }: PageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Only Admin can access
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = 50;
    const action = params.action || "all";
    const userId = params.userId || "";
    const status = params.status || "all";
    const search = params.search || "";
    const days = 90; // Default 90 days for audit

    // Parse dates
    let startDate, endDate;
    if (params.startDate) {
        startDate = new Date(params.startDate);
    }
    if (params.endDate) {
        endDate = new Date(params.endDate);
    }

    const auditResult = await getAuditTrail({
        page,
        limit,
        action: action !== "all" ? action : undefined,
        userId: userId || undefined,
        days,
    });

    const auditLogs = auditResult.success ? auditResult.data?.activities || [] : [];
    const pagination = auditResult.success ? auditResult.data?.pagination : null;

const statsResult = await getAuditStats(90);
const stats = statsResult.success ? statsResult.data : {
    total: 0,
    roleChanges: 0,
    userManagement: 0,
    projectDeletions: 0,
    taskDeletions: 0,
    successfulLogins: 0,
    failedLogins: 0,
    sensitiveActions: 0,
};

    return (
        <AdminAuditClient
            initialAuditLogs={auditLogs}
            initialPagination={pagination}
            initialStats={stats}
            currentAction={action}
            currentUserId={userId}
            currentStatus={status}
            currentSearch={search}
            currentPage={page}
        />
    );
}