"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { ProfileTasksTab } from "./ProfileTasksTab";
import { ProfileProjectsTab } from "./ProfileProjectsTab";
import { ProfileActivitiesTab } from "./ProfileActivitiesTab";

interface ProfileClientProps {
    user: any;
    workload: any;
    tasks: any[];
    projects: any[];
    activities: any[];
    userId: string;
}

export function ProfileClient({
    user,
    workload,
    tasks,
    projects,
    activities,
    userId,
}: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState("activities");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const isAdmin = user.role === "ADMIN";

    return (
        <div className="space-y-6" key={refreshKey}>
            <ProfileHeader user={user} onRefresh={handleRefresh} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    <ProfileInfoCard user={user} onRefresh={handleRefresh} />
                </div>

                {/* Right Column - Stats and Tabs */}
                <div className="lg:col-span-2 space-y-6 min-w-0">
                    {/* Only show stats for non-admin users */}
                    {!isAdmin && (
                        <ProfileStats workload={workload} projectsCount={projects.length} />
                    )}

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 w-full min-w-0 flex flex-col">
                        <TabsList className="flex flex-wrap">
                            {/* For non-admin users - show tasks and projects */}
                            {!isAdmin && (
                                <>
                                    <TabsTrigger value="tasks">
                                        My Tasks ({tasks.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="projects">
                                        My Projects ({projects.length})
                                    </TabsTrigger>
                                </>
                            )}
                            {/* For admin users - only show activities */}
                            <TabsTrigger value="activities">
                                Recent Activity ({activities.length})
                            </TabsTrigger>
                        </TabsList>

                        <div className="w-full overflow-x-auto">
                            {/* Tasks Tab - only for non-admin */}
                            {!isAdmin && (
                                <TabsContent value="tasks" className="space-y-4 m-0">
                                    <ProfileTasksTab
                                        userId={userId}
                                        initialTasks={tasks}
                                    />
                                </TabsContent>
                            )}

                            {/* Projects Tab - only for non-admin */}
                            {!isAdmin && (
                                <TabsContent value="projects" className="space-y-4 m-0">
                                    <ProfileProjectsTab
                                        projects={projects}
                                    />
                                </TabsContent>
                            )}

                            {/* Activities Tab - for all users */}
                            <TabsContent value="activities" className="space-y-4 m-0">
                                <ProfileActivitiesTab
                                    activities={activities}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}