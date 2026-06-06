"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDetailsHeader } from "./ProjectDetailsHeader";
import { ProjectStatsCards } from "./ProjectStatsCards";
import { ProjectTasksTab } from "./ProjectTasksTab";
import { ProjectMembersTab } from "./ProjectMembersTab";
import { ProjectActivitiesTab } from "./ProjectActivitiesTab";
import { ProjectSettingsTab } from "./ProjectSettingsTab";

interface ProjectDetailsClientProps {
    project: any;
    stats: any;
    members: any[];
    tasks: any[];
    activities: any[];
    canEdit: boolean;
    projectId: string;
}

export function ProjectDetailsClient({
    project,
    stats,
    members,
    tasks,
    activities,
    canEdit,
    projectId,
}: ProjectDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("tasks");

    const handleRefresh = () => {
        // ✅ Only refresh the router, don't remount the component
        router.refresh();
    };

    const tabs = [
        { value: "tasks", label: "Tasks", count: stats?.totalTasks || 0 },
        { value: "members", label: "Members", count: members.length },
        { value: "activities", label: "Activities", count: activities.length },
    ];

    if (canEdit) {
        tabs.push({ value: "settings", label: "Settings", count: undefined });
    }

    return (
        <div className="space-y-6">
            <ProjectDetailsHeader
                project={project}
                canEdit={canEdit}
                onProjectUpdate={handleRefresh}
            />

            <ProjectStatsCards stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="flex flex-col w-full gap-4">
                    <TabsList>
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

                    <TabsContent value="tasks" className="space-y-4">
                        <ProjectTasksTab
                            projectId={projectId}
                            initialTasks={tasks}
                            canEdit={canEdit}
                            members={members}
                            onTaskUpdate={handleRefresh}
                        />
                    </TabsContent>
                    <TabsContent value="members" className="space-y-4">
                        <ProjectMembersTab
                            projectId={projectId}
                            initialMembers={members}
                            canEdit={canEdit}
                            onMemberUpdate={handleRefresh}
                        />
                    </TabsContent>
                    <TabsContent value="activities" className="space-y-4">
                        <ProjectActivitiesTab
                            projectId={projectId}
                            initialActivities={activities}
                        />
                    </TabsContent>
                    {canEdit && (
                        <TabsContent value="settings" className="space-y-4">
                            <ProjectSettingsTab
                                project={project}
                                projectId={projectId}
                                onProjectUpdate={handleRefresh}
                            />
                        </TabsContent>
                    )}
                </div>
            </Tabs>
        </div>
    );
}