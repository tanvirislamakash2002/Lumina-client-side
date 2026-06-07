import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getAllUsers } from "@/actions/user.action";
import { getTeamStats } from "@/actions/stats.action";
import { TeamClient } from "@/components/modules/dashboard/manager/team/TeamClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        role?: string;
        status?: string;
        sort?: string;
    }>;
}

export default async function TeamPage({ searchParams }: PageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const search = params.search || "";
    const role = params.role || "all";
    const status = params.status || "all";
    const sort = params.sort || "name_asc";

    // Fetch users and team stats
    const [usersResult, statsResult] = await Promise.all([
        getAllUsers({ page, limit: 20, search, role, status, sort }),
        getTeamStats(),
    ]);

    const users = usersResult.success ? usersResult.data?.users || [] : [];
    const pagination = usersResult.success ? usersResult.data?.pagination : null;
    const userStats = usersResult.success ? usersResult.data?.stats : null;
    const teamStats = statsResult.success ? statsResult.data : null;

    const isAdmin = session.user.role === "ADMIN";

    return (
        <TeamClient
            initialUsers={users}
            initialPagination={pagination}
            userStats={userStats}
            teamStats={teamStats}
            isAdmin={isAdmin}
            currentSearch={search}
            currentRole={role}
            currentStatus={status}
            currentSort={sort}
            currentPage={page}
        />
    );
}