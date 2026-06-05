"use client";

import { AnalyticsHeader } from "./AnalyticsHeader";
import { OverviewKPIs } from "./OverviewKPIs";
import { UserAnalytics } from "./UserAnalytics";
import { ProjectAnalytics } from "./ProjectAnalytics";
import { TaskAnalytics } from "./TaskAnalytics";
import { ActivityAnalytics } from "./ActivityAnalytics";

interface AnalyticsClientProps {
    activityStats: any;
    userStats: any;
    projectStats: any;
    completionStats: any;
    days: number;
    compare: boolean;
}

export function AnalyticsClient({
    activityStats,
    userStats,
    projectStats,
    completionStats,
    days,
    compare,
}: AnalyticsClientProps) {
    return (
        <div className="space-y-6">
            <AnalyticsHeader days={days} />

            {/* Overview KPIs */}
            <OverviewKPIs
                activityStats={activityStats}
                userStats={userStats}
                projectStats={projectStats}
                completionStats={completionStats}
                compare={compare}
            />

            {/* User Analytics */}
            <UserAnalytics activityStats={activityStats} userStats={userStats} />

            {/* Project Analytics */}
            <ProjectAnalytics projectStats={projectStats} />

            {/* Task Analytics */}
            <TaskAnalytics completionStats={completionStats} />

            {/* Activity Analytics */}
            <ActivityAnalytics activityStats={activityStats} />
        </div>
    );
}