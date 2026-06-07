import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getTaskById } from "@/actions/task.action";
import { getProjects } from "@/actions/project.action";
import { getTeamMembers } from "@/actions/user.action";
import { EditTaskClient } from "@/components/modules/dashboard/manager/tasks/edit/EditTaskClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditTaskPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: taskId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch task details
    const taskResult = await getTaskById(taskId);

    if (!taskResult.success || !taskResult.data) {
        redirect("/dashboard/tasks");
    }

    const task = taskResult.data;
    const currentUserId = session.user.id;
    const userRole = session.user.role;

    // Check permissions: Admin, PM, or assigned user can edit
    const isAssigned = task.assignedTo?.id === currentUserId;
    const canEdit = userRole === "ADMIN" || userRole === "PROJECT_MANAGER" || isAssigned;

    if (!canEdit) {
        redirect(`/dashboard/tasks/${taskId}`);
    }

    // Fetch projects and team members for dropdowns
    const [projectsResult, membersResult] = await Promise.all([
        getProjects({ page: 1, limit: 100 }),
        getTeamMembers(),
    ]);

    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const members = membersResult.success ? membersResult.data || [] : [];

    // Determine if user is PM (for filtering assignee dropdown)
    const isPM = userRole === "PROJECT_MANAGER";
    const isAdmin = userRole === "ADMIN";

    return (
        <EditTaskClient
            task={task}
            projects={projects}
            members={members}
            canEditAll={!isAssigned || isAdmin || isPM}
            currentUserId={currentUserId}
            userRole={userRole}
            taskId={taskId}
        />
    );
}