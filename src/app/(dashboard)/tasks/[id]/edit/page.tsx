import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { EditTaskForm } from "@/components/modules/dashboard/tasks-add-edit/EditTaskForm";
import { getTaskById } from "@/actions/task.action";
import { getProjectMembers } from "@/actions/project-member.action";

export const dynamic = "force-dynamic";

interface EditTaskPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
    const { data: session } = await getSession();
    const { id: taskId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;
    const currentUserId = session.user.id;

    // Fetch task details
    const taskResult = await getTaskById(taskId);

    if (!taskResult.success || !taskResult.data) {
        notFound();
    }

    const task = taskResult.data;

    // Check if user can edit this task
    const canEdit = userRole === "ADMIN" || 
                    userRole === "PROJECT_MANAGER" || 
                    task.assignedTo?.id === currentUserId;

    if (!canEdit) {
        redirect(`/tasks/${taskId}`);
    }

    // Fetch project members for assignee dropdown
    const membersResult = await getProjectMembers(task.project.id, { page: 1, limit: 100 });
    const members = membersResult.success ? membersResult.data?.members || [] : [];

    return (
        <EditTaskForm
            task={task}
            members={members}
            userRole={userRole}
            currentUserId={currentUserId}
        />
    );
}