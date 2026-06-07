import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getTaskById } from "@/actions/task.action";
import { getTaskComments } from "@/actions/comment.action";
import { getTaskAttachments } from "@/actions/upload.action";
import { getTaskActivities } from "@/actions/activity.action";
import { TaskDetailsClient } from "@/components/modules/dashboard/manager/task-details/TaskDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TaskDetailsPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: taskId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch all task data in parallel
    const [taskResult, commentsResult, attachmentsResult, activitiesResult] = await Promise.all([
        getTaskById(taskId),
        getTaskComments(taskId, { page: 1, limit: 20 }),
        getTaskAttachments(taskId),
        getTaskActivities(taskId, { page: 1, limit: 20 }),
    ]);

    if (!taskResult.success || !taskResult.data) {
        redirect("/dashboard/tasks");
    }

    const task = taskResult.data;
    const comments = commentsResult.success ? commentsResult.data?.comments || [] : [];
    const attachments = attachmentsResult.success ? attachmentsResult.data || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data?.activities || [] : [];

    const userRole = session.user.role;
    const currentUserId = session.user.id;
    
    // Check permissions
    const isAssigned = task.assignedTo?.id === currentUserId;
    const canEdit = userRole === "ADMIN" || userRole === "PROJECT_MANAGER" || isAssigned;
    const canDelete = userRole === "ADMIN" || userRole === "PROJECT_MANAGER";

    return (
        <TaskDetailsClient
            task={task}
            comments={comments}
            attachments={attachments}
            activities={activities}
            canEdit={canEdit}
            canDelete={canDelete}
            currentUserId={currentUserId}
            userRole={userRole}
            taskId={taskId}
        />
    );
}