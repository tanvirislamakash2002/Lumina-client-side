import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { TasksClient } from "@/components/modules/dashboard/tasks/TasksClient";
import { getAllTasks } from "@/actions/task.action";
import { getTaskFilters } from "@/actions/filter.action";
import { getUserProjects } from "@/actions/project-member.action";
import { getTeamMembers } from "@/actions/user.action";

export const dynamic = "force-dynamic";

interface TasksPageProps {
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

export default async function TasksPage({ searchParams }: TasksPageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;
    const currentUserId = session.user.id;

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const search = params.search;
    const status = params.status;
    const priority = params.priority;
    const projectId = params.projectId;
    const assignedTo = params.assignedTo;
    const sortBy = params.sortBy;

    // Fetch tasks, filters, projects, and team members in parallel
    const [tasksResult, filtersResult, projectsResult, membersResult] = await Promise.all([
        getAllTasks({  
            page,
            limit: 20,
            search,
            status,
            priority,
            projectId,
            assignedTo: assignedTo === "me" ? currentUserId : assignedTo,
            sortBy,
        }),
        getTaskFilters(),
        getUserProjects({ page: 1, limit: 100 }),
        getTeamMembers(),
    ]);

    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const members = membersResult.success ? membersResult.data || [] : [];

    return (
        <TasksClient
            initialTasks={tasksResult.success ? tasksResult.data : null}
            initialFilters={filtersResult.success ? filtersResult.data : null}
            projects={projects}
            members={members}
            userRole={userRole}
            currentUserId={currentUserId}
            currentPage={page}
            currentSearch={search}
            currentStatus={status}
            currentPriority={priority}
            currentProjectId={projectId}
            currentAssignedTo={assignedTo}
            currentSortBy={sortBy}
        />
    );
}