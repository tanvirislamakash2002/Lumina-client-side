import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getProjectById } from "@/actions/project.action";
import { getProjectMembers } from "@/actions/project-member.action";
import { getTasks } from "@/actions/task.action";
import { getProjectActivities } from "@/actions/activity.action";
import { ProjectDetailsClient } from "@/components/modules/dashboard/project-details/ProjectDetailsClient";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { data: session } = await getSession();
    const { id: projectId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    // Fetch all data in parallel
    const [projectResult, membersResult, tasksResult, activitiesResult] = await Promise.all([
        getProjectById(projectId),
        getProjectMembers(projectId, { page: 1, limit: 50 }),
        getTasks(projectId, { page: 1, limit: 50 }),
        getProjectActivities(projectId, { page: 1, limit: 30 }),
    ]);

    // Handle project not found
    if (!projectResult.success || !projectResult.data) {
        notFound();
    }

    return (
        <ProjectDetailsClient
            project={projectResult.data}
            members={membersResult.success ? membersResult.data : null}
            tasks={tasksResult.success ? tasksResult.data : null}
            activities={activitiesResult.success ? activitiesResult.data : null}
            userRole={userRole}
            projectId={projectId}
        />
    );
}