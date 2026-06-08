"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProjectHeader } from "./AdminProjectHeader";
import { AdminProjectOverview } from "./AdminProjectOverview";
import { AdminProjectTasksTab } from "./AdminProjectTasksTab";
import { AdminProjectMembersTab } from "./AdminProjectMembersTab";
import { AdminProjectActivitiesTab } from "./AdminProjectActivitiesTab";
import { AdminProjectAnalyticsTab } from "./AdminProjectAnalyticsTab";

interface AdminProjectDetailsClientProps {
    project: any;
    stats: any;
    members: any[];
    tasks: any[];
    activities: any[];
    projectId: string;
}

export function AdminProjectDetailsClient({
    project,
    stats,
    members,
    tasks,
    activities,
    projectId,
}: AdminProjectDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("tasks");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
        router.refresh();
    };

    const tabs = [
        { value: "tasks", label: "Tasks", count: stats?.totalTasks || 0 },
        { value: "members", label: "Members", count: members.length },
        { value: "activities", label: "Activities", count: activities.length },
        { value: "analytics", label: "Analytics", count: undefined },
    ];

    return (
        <div className="space-y-6" key={refreshKey}>
            <AdminProjectHeader
                project={project}
                onRefresh={handleRefresh}
            />

            <AdminProjectOverview
                project={project}
                stats={stats}
                memberCount={members.length}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 flex flex-col">
                <TabsList className="flex-wrap">
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                                    {tab.count}
                                </span>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <>
                    <TabsContent value="tasks" className="space-y-4">
                        <AdminProjectTasksTab
                            projectId={projectId}
                            initialTasks={tasks}
                        />
                    </TabsContent>

                    <TabsContent value="members" className="space-y-4">
                        <AdminProjectMembersTab
                            members={members}
                        />
                    </TabsContent>

                    <TabsContent value="activities" className="space-y-4">
                        <AdminProjectActivitiesTab
                            projectId={projectId}
                            initialActivities={activities}
                        />
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <AdminProjectAnalyticsTab
                            stats={stats}
                        />
                    </TabsContent>
                </>
            </Tabs>
        </div>
    );
}