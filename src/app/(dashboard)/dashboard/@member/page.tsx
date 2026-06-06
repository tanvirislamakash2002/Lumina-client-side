import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getProjects } from "@/actions/project.action";
import { getMyTasks } from "@/actions/task.action";
import { getRecentActivities } from "@/actions/activity.action";
import { MemberDashboardClient } from "@/components/modules/dashboard/member/member-dashboard/MemberDashboardClient";

export const dynamic = "force-dynamic";

export default async function MemberDashboardSlot() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch all data in parallel
    const [projectsResult, tasksResult, activitiesResult] = await Promise.all([
        getProjects({ page: 1, limit: 100 }),
        getMyTasks({ page: 1, limit: 100, status: "all" }),
        getRecentActivities(10),
    ]);

    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data || [] : [];

    return (
        <MemberDashboardClient
            projects={projects}
            tasks={tasks}
            activities={activities}
        />
    );
}