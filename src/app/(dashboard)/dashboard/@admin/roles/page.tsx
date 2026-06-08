import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getAllUsers } from "@/actions/admin.action";
import { getAuditTrail } from "@/actions/admin.action";
import { AdminRolesClient } from "@/components/modules/dashboard/admin/roles/AdminRolesClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        role?: string;
        status?: string;
        auditPage?: string;
    }>;
}

export default async function AdminRolesPage({ searchParams }: PageProps) {
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
    const limit = 20;
    const search = params.search || "";
    const role = params.role || "all";
    const status = params.status || "all";
    const auditPage = parseInt(params.auditPage || "1");

    // Fetch users and audit trail in parallel
    const [usersResult, auditResult] = await Promise.all([
        getAllUsers({ page, limit, search, role, status }),
        getAuditTrail({ page: auditPage, limit: 20, days: 30, action: "ADMIN_ACTION" }), // Add action filter
    ]);

    const users = usersResult.success ? usersResult.data?.users || [] : [];
    const pagination = usersResult.success ? usersResult.data?.pagination : null;
    const stats = usersResult.success ? usersResult.data?.stats : null;
    const auditLog = auditResult.success ? auditResult.data?.activities || [] : [];
    const auditPagination = auditResult.success ? auditResult.data?.pagination : null;

    const currentUserId = session.user.id;
    const currentUserRole = session.user.role;
    const isSuperAdmin = session.user.email === process.env.SUPER_ADMIN_EMAIL; // Optional

    return (
        <AdminRolesClient
            initialUsers={users}
            initialPagination={pagination}
            initialStats={stats}
            auditLog={auditLog}
            auditPagination={auditPagination}
            currentUserId={currentUserId}
            isSuperAdmin={isSuperAdmin}
            currentSearch={search}
            currentRoleFilter={role}
            currentStatusFilter={status}
            currentPage={page}
            currentAuditPage={auditPage}
        />
    );
}