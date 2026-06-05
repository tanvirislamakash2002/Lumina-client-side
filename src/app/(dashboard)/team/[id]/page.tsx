import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { MemberDetailsClient } from "@/components/modules/dashboard/team-details/MemberDetailsClient";
import { getUserById } from "@/actions/user.action";
import { getMyTasks } from "@/actions/task.action";
import { getUserProjectsById } from "@/actions/project-member.action"; 
import { getSpecificUserActivities } from "@/actions/activity.action";  // ← Change this import

export const dynamic = "force-dynamic";

interface MemberDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function MemberDetailsPage({ params }: MemberDetailsPageProps) {
    const { data: session } = await getSession();
    const { id: userId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    const currentUserRole = session.user.role;
    const currentUserId = session.user.id;

    // Check if user can view this profile
    // Team members can only view their own profile
    if (currentUserRole !== "ADMIN" && currentUserRole !== "PROJECT_MANAGER" && currentUserId !== userId) {
        redirect("/team");
    }

    // Fetch user details
    const userResult = await getUserById(userId);

    if (!userResult.success || !userResult.data) {
        notFound();
    }

    // Fetch user's tasks, projects, and activities in parallel
    const [tasksResult, projectsResult, activitiesResult] = await Promise.all([
        getMyTasks({ page: 1, limit: 50 }),
        getUserProjectsById(userId, { page: 1, limit: 100 }),
        getSpecificUserActivities(userId, { page: 1, limit: 30 }),  // ← Changed here
    ]);

    // Filter tasks assigned to this user
    const userTasks = tasksResult.success && tasksResult.data 
        ? tasksResult.data.tasks?.filter((task: any) => task.assignedTo?.id === userId) || []
        : [];

    // Filter projects for this user
    const userProjectsList = projectsResult.success && projectsResult.data
        ? projectsResult.data.projects || []
        : [];

    const activities = activitiesResult.success ? activitiesResult.data : null;

    const canChangeRole = currentUserRole === "ADMIN";

    return (
        <MemberDetailsClient
            user={userResult.data}
            tasks={userTasks}
            projects={userProjectsList}
            activities={activities}
            canChangeRole={canChangeRole}
            currentUserId={currentUserId}
        />
    );
}