import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getUserById } from "@/actions/user.action";
import { getUserStatsById } from "@/actions/stats.action";
import { getAllTasks } from "@/actions/task.action";
import { getUserProjectsById } from "@/actions/project-member.action";  // ← Changed
import { getSpecificUserActivities } from "@/actions/activity.action";   // ← Changed
import { getSessions } from "@/actions/settings.action";
import { AdminUserDetailsClient } from "@/components/modules/dashboard/admin/users-details/AdminUserDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AdminUserDetailsPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: userId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    // Only Admin can access
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const currentUserId = session.user.id;
    const isOwnProfile = currentUserId === userId;

    // Fetch all user data in parallel
    const [userResult, statsResult, tasksResult, projectsResult, activitiesResult, sessionsResult] = await Promise.all([
        getUserById(userId),
        getUserStatsById(userId),
        getAllTasks({ page: 1, limit: 10, status: "all", assignedTo: userId }),
        getUserProjectsById(userId, { page: 1, limit: 10 }),        
        getSpecificUserActivities(userId, { page: 1, limit: 20 }),   
        getSessions(),
    ]);

    if (!userResult.success || !userResult.data) {
        redirect("/dashboard/admin/users");
    }

    const user = userResult.data;
    const stats = statsResult.success ? statsResult.data : null;
    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data?.activities || [] : [];
    const sessions = sessionsResult.success ? sessionsResult.data || [] : [];

    return (
        <AdminUserDetailsClient
            user={user}
            stats={stats}
            tasks={tasks}
            projects={projects}
            activities={activities}
            sessions={sessions}
            isOwnProfile={isOwnProfile}
            currentUserId={currentUserId}
            userId={userId}
        />
    );
}