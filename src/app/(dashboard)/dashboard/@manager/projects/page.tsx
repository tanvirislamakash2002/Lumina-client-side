import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getProjects } from "@/actions/project.action";
import { getTeamMembers } from "@/actions/user.action";
import { ManagerProjectsClient } from "@/components/modules/dashboard/manager/projects/ManagerProjectsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        sortBy?: string;
    }>;
}

export default async function ManagerProjectsPage({ searchParams }: PageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const search = params.search || "";
    const status = params.status || "all";
    const sortBy = params.sortBy || "latest";

    // Fetch projects and team members in parallel
    const [projectsResult, membersResult] = await Promise.all([
        getProjects({ page, limit: 10, search, status, sortBy }),
        getTeamMembers(),
    ]);

    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const pagination = projectsResult.success ? projectsResult.data?.pagination : null;
    const stats = projectsResult.success ? projectsResult.data?.stats : null;
    const members = membersResult.success ? membersResult.data || [] : [];

    return (
        <ManagerProjectsClient
            initialProjects={projects}
            initialPagination={pagination}
            initialStats={stats}
            members={members}
            currentSearch={search}
            currentStatus={status}
            currentSortBy={sortBy}
            currentPage={page}
        />
    );
}