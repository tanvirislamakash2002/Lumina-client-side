import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { AuditClient } from "@/components/modules/dashboard/admin/audit/AuditClient";
import { getAuditTrail } from "@/actions/admin.action";
import { getAllUsers } from "@/actions/admin.action";

export const dynamic = "force-dynamic";

interface AuditPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        userId?: string;
        action?: string;
        days?: string;
        search?: string;
    }>;
}

export default async function AuditPage({ searchParams }: AuditPageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    if (userRole !== "ADMIN") {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = parseInt(params.limit || "30");
    const userId = params.userId;
    const action = params.action;
    const days = parseInt(params.days || "30");
    const search = params.search;

    const [auditResult, usersResult] = await Promise.all([
        getAuditTrail({
            page,
            limit,
            userId,
            action,
            days,
        }),
        getAllUsers({ page: 1, limit: 100 }),
    ]);

    const users = usersResult.success ? usersResult.data?.users || [] : [];

    return (
        <AuditClient
            initialData={auditResult.success ? auditResult.data : null}
            users={users}
            currentPage={page}
            currentLimit={limit}
            currentUserId={userId}
            currentAction={action}
            currentDays={days}
            currentSearch={search}
        />
    );
}