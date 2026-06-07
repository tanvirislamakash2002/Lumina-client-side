import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getProjectById } from "@/actions/project.action";
import { getProjectStats } from "@/actions/project.action";
import { getProjectMembers } from "@/actions/project-member.action";
import { getTasks } from "@/actions/task.action";
import { getProjectActivities } from "@/actions/activity.action";
import { MemberProjectDetailsClient } from "@/components/modules/dashboard/member/my-projects-details/MemberProjectDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MemberProjectDetailsPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: projectId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    const currentUserId = session.user.id;

    // Fetch all project data in parallel
    const [projectResult, statsResult, membersResult, tasksResult, activitiesResult] = await Promise.all([
        getProjectById(projectId),
        getProjectStats(projectId),
        getProjectMembers(projectId, { page: 1, limit: 50 }),
        getTasks(projectId, { page: 1, limit: 20, sortBy: "latest" }),
        getProjectActivities(projectId, { page: 1, limit: 20 }),
    ]);

    if (!projectResult.success) {
        redirect("/dashboard/my-projects");
    }

    // Check if user is a member of the project
    const project = projectResult.data;
    const isMember = project.members?.some((m: any) => m.id === currentUserId);
    
    if (!isMember && session.user.role !== "ADMIN") {
        redirect("/dashboard/my-projects");
    }

    const stats = statsResult.success ? statsResult.data : null;
    const members = membersResult.success ? membersResult.data?.members || [] : [];
    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data?.activities || [] : [];

    const userRole = session.user.role;
    const isTeamMember = userRole === "TEAM_MEMBER";
    const currentUser = session.user;

    return (
        <MemberProjectDetailsClient
            project={project}
            stats={stats}
            members={members}
            tasks={tasks}
            activities={activities}
            currentUser={currentUser}
            isTeamMember={isTeamMember}
            projectId={projectId}
        />
    );
}