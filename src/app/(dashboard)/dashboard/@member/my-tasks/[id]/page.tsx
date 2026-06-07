import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getTaskById } from "@/actions/task.action";
import { getTaskComments } from "@/actions/comment.action";
import { getTaskAttachments } from "@/actions/upload.action";
import { getTaskActivities } from "@/actions/activity.action";
import { MemberTaskDetailsClient } from "@/components/modules/tasks/member-tasks/MemberTaskDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MemberTaskDetailsPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: taskId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    const currentUserId = session.user.id;

    // Fetch task details
    const taskResult = await getTaskById(taskId);

    if (!taskResult.success || !taskResult.data) {
        redirect("/dashboard/my-tasks");
    }

    const task = taskResult.data;

    // Check if task is assigned to current user
    const isAssigned = task.assignedTo?.id === currentUserId;
    const isAdmin = session.user.role === "ADMIN";

    if (!isAssigned && !isAdmin) {
        redirect("/dashboard/my-tasks");
    }

    // Fetch comments, attachments, and activities in parallel
    const [commentsResult, attachmentsResult, activitiesResult] = await Promise.all([
        getTaskComments(taskId, { page: 1, limit: 20 }),
        getTaskAttachments(taskId),
        getTaskActivities(taskId, { page: 1, limit: 20 }),
    ]);

    const comments = commentsResult.success ? commentsResult.data?.comments || [] : [];
    const attachments = attachmentsResult.success ? attachmentsResult.data || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data?.activities || [] : [];

    return (
        <MemberTaskDetailsClient
            task={task}
            comments={comments}
            attachments={attachments}
            activities={activities}
            currentUserId={currentUserId}
            taskId={taskId}
        />
    );
}