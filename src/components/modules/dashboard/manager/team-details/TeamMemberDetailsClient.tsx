"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMemberHeader } from "./TeamMemberHeader";
import { TeamMemberStats } from "./TeamMemberStats";
import { TeamMemberTasksTab } from "./TeamMemberTasksTab";
import { TeamMemberProjectsTab } from "./TeamMemberProjectsTab";
import { TeamMemberActivitiesTab } from "./TeamMemberActivitiesTab";
import { TeamMemberAdminActions } from "./TeamMemberAdminActions";

interface TeamMemberDetailsClientProps {
    user: any;
    stats: any;
    projects: any[];
    activities: any[];
    tasks: any[];
    isAdmin: boolean;
    isOwnProfile: boolean;
    currentUserId: string;
    userId: string;
}

export function TeamMemberDetailsClient({
    user,
    stats,
    projects,
    activities,
    tasks,
    isAdmin,
    isOwnProfile,
    currentUserId,
    userId,
}: TeamMemberDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("tasks");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
        router.refresh();
    };

    return (
        <div className="space-y-6" key={refreshKey}>
            <TeamMemberHeader
                user={user}
                isAdmin={isAdmin}
                isOwnProfile={isOwnProfile}
                onRefresh={handleRefresh}
            />

            <TeamMemberStats stats={stats} projectsCount={projects.length} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tasks">
                        Tasks ({stats?.totalTasks || 0})
                    </TabsTrigger>
                    <TabsTrigger value="projects">
                        Projects ({projects.length})
                    </TabsTrigger>
                    <TabsTrigger value="activities">
                        Activities ({activities.length})
                    </TabsTrigger>
                    {(isAdmin || isOwnProfile) && (
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="tasks" className="space-y-4">
                    <TeamMemberTasksTab
                        userId={userId}
                        initialTasks={tasks}
                        userName={user.name}
                    />
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                    <TeamMemberProjectsTab
                        projects={projects}
                    />
                </TabsContent>

                <TabsContent value="activities" className="space-y-4">
                    <TeamMemberActivitiesTab
                        activities={activities}
                    />
                </TabsContent>

                {(isAdmin || isOwnProfile) && (
                    <TabsContent value="settings" className="space-y-4">
                        <TeamMemberAdminActions
                            user={user}
                            isAdmin={isAdmin}
                            isOwnProfile={isOwnProfile}
                            onRefresh={handleRefresh}
                        />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}