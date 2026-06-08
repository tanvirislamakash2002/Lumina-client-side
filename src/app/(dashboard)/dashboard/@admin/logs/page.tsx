import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getSystemLogs } from "@/actions/admin.action";
import { getActivityStats } from "@/actions/activity.action";
import { AdminLogsClient } from "@/components/modules/dashboard/admin/logs/AdminLogsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        level?: string;
        startDate?: string;
        endDate?: string;
        userId?: string;
        action?: string;
    }>;
}

export default async function AdminLogsPage({ searchParams }: PageProps) {
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
    const search = params.search || "";
    const level = params.level || "all";
    const days = 30;

    // Fetch logs and stats in parallel
    const [logsResult, statsResult] = await Promise.all([
        getSystemLogs({
            page,
            limit,
            level: level !== "all" ? level : undefined,
            days,
        }),
        getActivityStats(days),
    ]);

    const logs = logsResult.success ? logsResult.data?.logs || [] : [];
    const pagination = logsResult.success ? logsResult.data?.pagination : null;

    // Build stats from activity stats (REAL DATA)
    let stats = {
        total: 0,
        errors: 0,
        warnings: 0,
        info: 0,
        adminActions: 0,
        failedLogins: 0,
    };

    if (statsResult.success && statsResult.data) {
        const actionStats = statsResult.data.actionStats || [];
        stats = {
            total: statsResult.data.totalActivities || 0,
            errors: actionStats.find((a: any) => a.action === "ERROR")?.count || 0,
            warnings: actionStats.find((a: any) => a.action === "WARNING")?.count || 0,
            info: actionStats.find((a: any) => a.action === "INFO")?.count || 0,
            adminActions: actionStats.find((a: any) => a.action === "ADMIN_ACTION")?.count || 0,
            failedLogins: actionStats.find((a: any) => a.action === "FAILED_LOGIN")?.count || 0,
        };
    }

    return (
        <AdminLogsClient
            initialLogs={logs}
            initialPagination={pagination}
            initialStats={stats}
            currentSearch={search}
            currentLevel={level}
            currentPage={page}
        />
    );
}