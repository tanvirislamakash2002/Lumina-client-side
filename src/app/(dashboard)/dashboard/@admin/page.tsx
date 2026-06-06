import { getAdminDashboard } from "@/actions/admin.action";
import { getSystemStats } from "@/actions/admin.action";
import { getAllUsers } from "@/actions/user.action";
import { getAllProjects } from "@/actions/admin.action";
import { getRecentActivities } from "@/actions/activity.action";
import { AdminDashboardClient } from "@/components/modules/dashboard/admin/admin-dashboard/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardSlot() {
    // No role check needed - layout guarantees this is for ADMIN only

    const [dashboardResult, statsResult, usersResult, projectsResult, activitiesResult] = await Promise.all([
        getAdminDashboard(),
        getSystemStats(),
        getAllUsers({ page: 1, limit: 5 }),
        getAllProjects({ page: 1, limit: 5 }),
        getRecentActivities(10),
    ]);

    return (
        <AdminDashboardClient
            dashboardData={dashboardResult.success ? dashboardResult.data : null}
            statsData={statsResult.success ? statsResult.data : null}
            recentUsers={usersResult.success ? usersResult.data?.users || [] : []}
            recentProjects={projectsResult.success ? projectsResult.data?.projects || [] : []}
            recentActivities={activitiesResult.success ? activitiesResult.data : []}
        />
    );
}