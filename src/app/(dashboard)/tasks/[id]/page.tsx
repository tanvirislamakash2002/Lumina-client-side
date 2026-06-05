import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { TaskDetailsClient } from "@/components/modules/dashboard/tasks-details/TaskDetailsClient";
import { getTaskById } from "@/actions/task.action";
import { getTaskComments } from "@/actions/comment.action";
import { getTaskAttachments } from "@/actions/upload.action";
import { getTaskActivities } from "@/actions/activity.action";

export const dynamic = "force-dynamic";

interface TaskDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function TaskDetailsPage({ params }: TaskDetailsPageProps) {
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

    // Fetch comments, attachments, and activities in parallel
    const [commentsResult, attachmentsResult, activitiesResult] = await Promise.all([
        getTaskComments(taskId, { page: 1, limit: 50 }),
        getTaskAttachments(taskId),
        getTaskActivities(taskId, { page: 1, limit: 30 }),
    ]);

    const comments = commentsResult.success ? commentsResult.data : null;
    const attachments = attachmentsResult.success ? attachmentsResult.data : null;
    const activities = activitiesResult.success ? activitiesResult.data : null;

    return (
        <TaskDetailsClient
            task={taskResult.data}
            comments={comments}
            attachments={attachments}
            activities={activities}
            userRole={userRole}
            currentUserId={currentUserId}
        />
    );
}