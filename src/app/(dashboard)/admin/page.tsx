import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { AdminClient } from "@/components/modules/dashboard/admin/admin-dashboard/AdminClient";
import { getAdminDashboard } from "@/actions/admin.action";
import { getSystemStats } from "@/actions/admin.action";
import { getAllUsers } from "@/actions/user.action";
import { getAllProjects } from "@/actions/admin.action";
import { getRecentActivities } from "@/actions/activity.action";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    // Only admins can access
    if (userRole !== "ADMIN") {
        redirect("/dashboard");
    }

    // Fetch all data in parallel
    const [dashboardResult, statsResult, usersResult, projectsResult, activitiesResult] = await Promise.all([
        getAdminDashboard(),
        getSystemStats(),
        getAllUsers({ page: 1, limit: 5 }),
        getAllProjects({ page: 1, limit: 5 }),
        getRecentActivities(10),
    ]);

    return (
        <AdminClient
            dashboardData={dashboardResult.success ? dashboardResult.data : null}
            statsData={statsResult.success ? statsResult.data : null}
            recentUsers={usersResult.success ? usersResult.data?.users || [] : []}
            recentProjects={projectsResult.success ? projectsResult.data?.projects || [] : []}
            recentActivities={activitiesResult.success ? activitiesResult.data : []}
        />
    );
}