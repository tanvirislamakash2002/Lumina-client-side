import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getTaskById } from "@/actions/task.action";
import { getTaskComments } from "@/actions/comment.action";
import { getTaskAttachments } from "@/actions/upload.action";
import { getTaskActivities } from "@/actions/activity.action";
import { AdminTaskDetailsClient } from "@/components/modules/dashboard/admin/task-details/AdminTaskDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AdminTaskDetailsPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: taskId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    // Only Admin can access
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Fetch all task data in parallel
    const [taskResult, commentsResult, attachmentsResult, activitiesResult] = await Promise.all([
        getTaskById(taskId),
        getTaskComments(taskId, { page: 1, limit: 20 }),
        getTaskAttachments(taskId),
        getTaskActivities(taskId, { page: 1, limit: 30 }),
    ]);

    if (!taskResult.success || !taskResult.data) {
        redirect("/dashboard/tasks");
    }

    const task = taskResult.data;
    const comments = commentsResult.success ? commentsResult.data?.comments || [] : [];
    const attachments = attachmentsResult.success ? attachmentsResult.data || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data?.activities || [] : [];

    return (
        <AdminTaskDetailsClient
            task={task}
            comments={comments}
            attachments={attachments}
            activities={activities}
            taskId={taskId}
        />
    );
}