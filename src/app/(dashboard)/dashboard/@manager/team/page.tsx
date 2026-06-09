import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getTeamMembersWithProjects } from "@/actions/user.action";
import { getTeamStats } from "@/actions/stats.action";
import { TeamClient } from "@/components/modules/dashboard/manager/team/TeamClient";
import { getProjects } from "@/actions/project.action";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        projectId?: string;
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
    const projectId = params.projectId || "all";

    const [usersResult, projectsResult, statsResult] = await Promise.all([
        getTeamMembersWithProjects(session.user.id, session.user.role, {
            search,
            projectId: projectId !== "all" ? projectId : undefined,
            page,
            limit: 20,
        }),
        getProjects({ page: 1, limit: 100 }),
        getTeamStats(),
    ]);

    const users = usersResult.success ? usersResult.data?.members || [] : [];
    const pagination = usersResult.success ? usersResult.data?.pagination : null;
    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const teamStats = statsResult.success ? statsResult.data : null;

    const isAdmin = session.user.role === "ADMIN";

    // Calculate user stats from the fetched members
    const userStats = {
        totalUsers: users.length,
        adminCount: users.filter((u: any) => u.role === "ADMIN").length,
        projectManagerCount: users.filter((u: any) => u.role === "PROJECT_MANAGER").length,
        teamMemberCount: users.filter((u: any) => u.role === "TEAM_MEMBER").length,
        activeUsers: users.filter((u: any) => u.accountStatus === "ACTIVE").length,
    };

    return (
        <TeamClient
            initialUsers={users}
            initialPagination={pagination}
            userStats={userStats}
            teamStats={teamStats}
            projects={projects}
            isAdmin={isAdmin}
            currentSearch={search}
            currentProjectId={projectId}  
            currentSort="name_asc"
            currentPage={page}
        />
    );
}