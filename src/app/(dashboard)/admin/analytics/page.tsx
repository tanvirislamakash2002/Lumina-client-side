import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "@/components/modules/dashboard/admin/analytics/AnalyticsClient";
import { getActivityStats } from "@/actions/activity.action";
import { getUserStats } from "@/actions/stats.action";
import { getProjectStats } from "@/actions/stats.action";
import { getCompletionStats } from "@/actions/stats.action";

export const dynamic = "force-dynamic";

interface AnalyticsPageProps {
    searchParams: Promise<{
        days?: string;
        compare?: string;
    }>;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    if (userRole !== "ADMIN") {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const days = parseInt(params.days || "30");
    const compare = params.compare === "true";

    // Fetch all analytics data in parallel
    const [activityStatsResult, userStatsResult, projectStatsResult, completionStatsResult] = await Promise.all([
        getActivityStats(days),
        getUserStats(),
        getProjectStats("all"),
        getCompletionStats(),
    ]);

    return (
        <AnalyticsClient
            activityStats={activityStatsResult.success ? activityStatsResult.data : null}
            userStats={userStatsResult.success ? userStatsResult.data : null}
            projectStats={projectStatsResult.success ? projectStatsResult.data : null}
            completionStats={completionStatsResult.success ? completionStatsResult.data : null}
            days={days}
            compare={compare}
        />
    );
}