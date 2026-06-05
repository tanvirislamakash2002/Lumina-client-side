import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { ProjectsClient } from "@/components/modules/dashboard/projects/ProjectsClient";
import { getProjects } from "@/actions/project.action";
import { getProjectFilters } from "@/actions/filter.action";

export const dynamic = "force-dynamic";

interface SearchParams {
    page?: string;
    search?: string;
    status?: string;
    sortBy?: string;
}

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const { data: session } = await getSession();

    // if (!session?.user) {
    //     redirect("/login");
    // }

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const search = params.search;
    const status = params.status;
    const sortBy = params.sortBy;

    // Fetch projects and filter options in parallel
    const [projectsResult, filtersResult] = await Promise.all([
        getProjects({
            page,
            limit: 10,
            search,
            status,
            sortBy,
        }),
        getProjectFilters(),
    ]);

    const projects = projectsResult.success ? projectsResult.data : null;
    const filters = filtersResult.success ? filtersResult.data : null;

    return (
        <ProjectsClient
            initialProjects={projects}
            initialFilters={filters}
            currentPage={page}
            currentSearch={search}
            currentStatus={status}
            currentSortBy={sortBy}
            userRole={session.user.role}
        />
    );
}