import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getUserById } from "@/actions/user.action";
import { getUserStatsById } from "@/actions/stats.action";
import { getUserProjectsById } from "@/actions/project-member.action";
import { getSpecificUserActivities } from "@/actions/activity.action";
import { getMyTasks } from "@/actions/task.action";
import { TeamMemberDetailsClient } from "@/components/modules/dashboard/manager/team-details/TeamMemberDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TeamMemberDetailsPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: userId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    const currentUserId = session.user.id;
    const currentUserRole = session.user.role;

    // Check permissions: Admin can view any, PM can view team members, Member can only view themselves
    const canView = currentUserRole === "ADMIN" || 
                    currentUserRole === "PROJECT_MANAGER" || 
                    currentUserId === userId;

    if (!canView) {
        redirect("/dashboard/team");
    }

    // Fetch all user data in parallel
    const [userResult, statsResult, projectsResult, activitiesResult, tasksResult] = await Promise.all([
        getUserById(userId),
        getUserStatsById(userId),
        getUserProjectsById(userId, { page: 1, limit: 50 }),
        getSpecificUserActivities(userId, { page: 1, limit: 20 }),
        getMyTasks({ page: 1, limit: 20, status: "all" }),
    ]);

    if (!userResult.success || !userResult.data) {
        redirect("/dashboard/team");
    }

    const user = userResult.data;
    const stats = statsResult.success ? statsResult.data : null;
    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data?.activities || [] : [];
    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];

    const isAdmin = currentUserRole === "ADMIN";
    const isOwnProfile = currentUserId === userId;

    return (
        <TeamMemberDetailsClient
            user={user}
            stats={stats}
            projects={projects}
            activities={activities}
            tasks={tasks}
            isAdmin={isAdmin}
            isOwnProfile={isOwnProfile}
            currentUserId={currentUserId}
            userId={userId}
        />
    );
}