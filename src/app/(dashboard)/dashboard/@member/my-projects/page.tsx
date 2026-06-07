import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getProjects } from "@/actions/project.action";
import { MemberProjectsClient } from "@/components/modules/dashboard/member/my-projects/MemberProjectsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        sortBy?: string;
    }>;
}

export default async function MemberProjectsPage({ searchParams }: PageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const search = params.search || "";
    const status = params.status || "all";
    const sortBy = params.sortBy || "latest";

    // Fetch projects (team member only sees their projects)
    const projectsResult = await getProjects({ page, limit: 12, search, status, sortBy });

    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const pagination = projectsResult.success ? projectsResult.data?.pagination : null;
    const stats = projectsResult.success ? projectsResult.data?.stats : null;

    const currentUser = session.user;

    return (
        <MemberProjectsClient
            initialProjects={projects}
            initialPagination={pagination}
            initialStats={stats}
            currentUser={currentUser}
            currentSearch={search}
            currentStatus={status}
            currentSortBy={sortBy}
            currentPage={page}
        />
    );
}