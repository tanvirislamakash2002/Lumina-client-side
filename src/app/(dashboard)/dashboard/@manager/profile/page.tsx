import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getProfile } from "@/actions/user.action";
import { getUserWorkload } from "@/actions/user.action";
import { getMyTasks } from "@/actions/task.action";
import { getUserProjects } from "@/actions/project-member.action";
import { getUserActivities } from "@/actions/activity.action";
import { ProfileClient } from "@/components/modules/dashboard/manager/profile/ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userId = session.user.id;

    // Fetch all profile data in parallel
    const [profileResult, workloadResult, tasksResult, projectsResult, activitiesResult] = await Promise.all([
        getProfile(),
        getUserWorkload(),
        getMyTasks({ page: 1, limit: 10, status: "all" }),
        getUserProjects({ page: 1, limit: 10 }),
        getUserActivities({ page: 1, limit: 10 }),
    ]);

    const user = profileResult.success ? profileResult.data : null;
    const workload = workloadResult.success ? workloadResult.data : null;
    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data || [] : [];

    if (!user) {
        redirect("/dashboard");
    }

    return (
        <ProfileClient
            user={user}
            workload={workload}
            tasks={tasks}
            projects={projects}
            activities={activities}
            userId={userId}
        />
    );
}