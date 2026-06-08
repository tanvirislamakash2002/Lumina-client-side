import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getProjectById } from "@/actions/project.action";
import { getProjectStats } from "@/actions/project.action";
import { getProjectMembers } from "@/actions/project-member.action";
import { getAllTasks } from "@/actions/task.action";
import { getProjectActivities } from "@/actions/activity.action";
import { AdminProjectDetailsClient } from "@/components/modules/dashboard/admin/project-details/AdminProjectDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AdminProjectDetailsPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: projectId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    // Only Admin can access
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Fetch all project data in parallel
    const [projectResult, statsResult, membersResult, tasksResult, activitiesResult] = await Promise.all([
        getProjectById(projectId),
        getProjectStats(projectId),
        getProjectMembers(projectId, { page: 1, limit: 100 }),
        getAllTasks({ page: 1, limit: 20, status: "all", projectId }),
        getProjectActivities(projectId, { page: 1, limit: 30 }),
    ]);

    if (!projectResult.success || !projectResult.data) {
        redirect("/dashboard/admin/projects");
    }

    const project = projectResult.data;
    const stats = statsResult.success ? statsResult.data : null;
    const members = membersResult.success ? membersResult.data?.members || [] : [];
    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data?.activities || [] : [];

    return (
        <AdminProjectDetailsClient
            project={project}
            stats={stats}
            members={members}
            tasks={tasks}
            activities={activities}
            projectId={projectId}
        />
    );
}