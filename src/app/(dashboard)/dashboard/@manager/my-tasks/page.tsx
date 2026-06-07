import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getMyTasks } from "@/actions/task.action";
import { getProjects } from "@/actions/project.action";
import { MyTasksClient } from "@/components/modules/dashboard/manager/my-tasks/MyTasksClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        priority?: string;
        projectId?: string;
        sortBy?: string;
    }>;
}

export default async function MyTasksPage({ searchParams }: PageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const search = params.search || "";
    const status = params.status || "all";
    const priority = params.priority || "all";
    const projectId = params.projectId || "all";
    const sortBy = params.sortBy || "latest";

    // Fetch tasks assigned to current user and projects they have access to
    const [tasksResult, projectsResult] = await Promise.all([
        getMyTasks({ page, limit: 20, search, status, projectId: projectId !== "all" ? projectId : undefined }),
        getProjects({ page: 1, limit: 100 }),
    ]);

    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    const pagination = tasksResult.success ? tasksResult.data?.pagination : null;
    const stats = tasksResult.success ? tasksResult.data?.stats : null;
    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];

    return (
        <MyTasksClient
            initialTasks={tasks}
            initialPagination={pagination}
            initialStats={stats}
            projects={projects}
            currentSearch={search}
            currentStatus={status}
            currentPriority={priority}
            currentProjectId={projectId}
            currentSortBy={sortBy}
            currentPage={page}
        />
    );
}