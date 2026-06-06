import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getAllTasks } from "@/actions/task.action";
import { getProjects } from "@/actions/project.action";
import { getTeamMembers } from "@/actions/user.action";
import { ManagerTasksClient } from "@/components/modules/dashboard/manager/tasks/ManagerTasksClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        priority?: string;
        projectId?: string;
        assignedTo?: string;
        sortBy?: string;
    }>;
}

export default async function ManagerTasksPage({ searchParams }: PageProps) {
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
    const assignedTo = params.assignedTo || "all";
    const sortBy = params.sortBy || "latest";

    // Fetch all data in parallel
    const [tasksResult, projectsResult, membersResult] = await Promise.all([
        getAllTasks({ page, limit: 20, search, status, priority, projectId, assignedTo, sortBy }),
        getProjects({ page: 1, limit: 100 }),
        getTeamMembers(),
    ]);

    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    const pagination = tasksResult.success ? tasksResult.data?.pagination : null;
    const stats = tasksResult.success ? tasksResult.data?.stats : null;
    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const members = membersResult.success ? membersResult.data || [] : [];

    return (
        <ManagerTasksClient
            initialTasks={tasks}
            initialPagination={pagination}
            initialStats={stats}
            projects={projects}
            members={members}
            currentSearch={search}
            currentStatus={status}
            currentPriority={priority}
            currentProjectId={projectId}
            currentAssignedTo={assignedTo}
            currentSortBy={sortBy}
            currentPage={page}
        />
    );
}