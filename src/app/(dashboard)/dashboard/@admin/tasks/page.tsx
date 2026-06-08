import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getAllTasks } from "@/actions/task.action";
import { getAllProjects } from "@/actions/admin.action";
import { getAllUsers } from "@/actions/admin.action";
import { AdminTasksClient } from "@/components/modules/dashboard/admin/tasks/AdminTasksClient";

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

export default async function AdminTasksPage({ searchParams }: PageProps) {
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
    const status = params.status || "all";
    const priority = params.priority || "all";
    const projectId = params.projectId || "all";
    const assignedTo = params.assignedTo || "all";
    const sortBy = params.sortBy || "latest";

    // Fetch all data in parallel
    const [tasksResult, projectsResult, usersResult] = await Promise.all([
        getAllTasks({ page, limit, search, status, priority, projectId, assignedTo, sortBy }),
        getAllProjects({ page: 1, limit: 100 }),
        getAllUsers({ page: 1, limit: 100 }),
    ]);

    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    const pagination = tasksResult.success ? tasksResult.data?.pagination : null;
    const stats = tasksResult.success ? tasksResult.data?.stats : null;
    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const users = usersResult.success ? usersResult.data?.users || [] : [];

    return (
        <AdminTasksClient
            initialTasks={tasks}
            initialPagination={pagination}
            initialStats={stats}
            projects={projects}
            users={users}
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