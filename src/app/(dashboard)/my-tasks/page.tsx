import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { MyTasksClient } from "@/components/modules/dashboard/my-tasks/MyTasksClient";
import { getMyTasks } from "@/actions/task.action";
import { getUserProjects } from "@/actions/project-member.action";

export const dynamic = "force-dynamic";

interface MyTasksPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        projectId?: string;
        sortBy?: string;
    }>;
}

export default async function MyTasksPage({ searchParams }: MyTasksPageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const currentUserId = session.user.id;

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const search = params.search;
    const status = params.status;
    const projectId = params.projectId;
    const sortBy = params.sortBy;

    // Fetch my tasks and projects in parallel
    const [tasksResult, projectsResult] = await Promise.all([
        getMyTasks({
            page,
            limit: 20,
            search,
            status,
            projectId,
        }),
        getUserProjects({ page: 1, limit: 100 }),
    ]);

    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];

    return (
        <MyTasksClient
            initialTasks={tasksResult.success ? tasksResult.data : null}
            projects={projects}
            currentUserId={currentUserId}
            currentPage={page}
            currentSearch={search}
            currentStatus={status}
            currentProjectId={projectId}
            currentSortBy={sortBy}
        />
    );
}