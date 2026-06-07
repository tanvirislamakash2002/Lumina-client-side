import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getPlatformStats } from "@/actions/stats.action";
import { getSystemStats } from "@/actions/admin.action";
import { getActivityStats } from "@/actions/activity.action";
import { getTeamStats } from "@/actions/stats.action";
import { AdminAnalyticsClient } from "@/components/modules/dashboard/admin/analytics/AdminAnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Only Admin can access
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Fetch all analytics data in parallel
    const [platformStatsResult, systemStatsResult, activityStatsResult, teamStatsResult] = await Promise.all([
        getPlatformStats(),
        getSystemStats(),
        getActivityStats(30),
        getTeamStats(),
    ]);

    const platformStats = platformStatsResult.success ? platformStatsResult.data : null;
    const systemStats = systemStatsResult.success ? systemStatsResult.data : null;
    const activityStats = activityStatsResult.success ? activityStatsResult.data : null;
    const teamStats = teamStatsResult.success ? teamStatsResult.data : null;

    return (
        <AdminAnalyticsClient
            platformStats={platformStats}
            systemStats={systemStats}
            activityStats={activityStats}
            teamStats={teamStats}
        />
    );
}