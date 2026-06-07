import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getAllUsers } from "@/actions/admin.action";
import { AdminUsersClient } from "@/components/modules/dashboard/admin/users/AdminUsersClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        role?: string;
        status?: string;
        verified?: string;
        sort?: string;
    }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
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
    const verified = params.verified || "all";
    const sort = params.sort || "newest";

    const usersResult = await getAllUsers({
        page,
        limit,
        search,
        role,
        status,
        verified,
        sort,
    });

    const users = usersResult.success ? usersResult.data?.users || [] : [];
    const pagination = usersResult.success ? usersResult.data?.pagination : null;
    const stats = usersResult.success ? usersResult.data?.stats : null;

    return (
        <AdminUsersClient
            initialUsers={users}
            initialPagination={pagination}
            initialStats={stats}
            currentUserId={session.user.id}
            currentSearch={search}
            currentRole={role}
            currentStatus={status}
            currentVerified={verified}
            currentSort={sort}
            currentPage={page}
        />
    );
}