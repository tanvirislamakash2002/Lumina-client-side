import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getProjects } from "@/actions/project.action";
import { getAllTasks } from "@/actions/task.action";
import { getTeamMembers } from "@/actions/user.action";
import { getRecentActivities } from "@/actions/activity.action";
import { PMDashboardClient } from "@/components/modules/dashboard/manager/manager-dashboard/PMDashboardClient";

export const dynamic = "force-dynamic";

export default async function PMDashboardSlot() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch all data in parallel
    const [projectsResult, tasksResult, membersResult, activitiesResult] = await Promise.all([
        getProjects({ page: 1, limit: 100 }),
        getAllTasks({ page: 1, limit: 100, status: "all" }),
        getTeamMembers(),
        getRecentActivities(10),
    ]);

    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const tasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    const members = membersResult.success ? membersResult.data || [] : [];
    const activities = activitiesResult.success ? activitiesResult.data || [] : [];

    return (
        <PMDashboardClient
            projects={projects}
            tasks={tasks}
            members={members}
            activities={activities}
        />
    );
}