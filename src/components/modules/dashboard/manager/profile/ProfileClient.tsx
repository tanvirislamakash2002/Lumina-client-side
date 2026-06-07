"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { ProfileTasksTab } from "./ProfileTasksTab";
import { ProfileProjectsTab } from "./ProfileProjectsTab";
import { ProfileActivitiesTab } from "./ProfileActivitiesTab";
import { ProfileChangePassword } from "./ProfileChangePassword";

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
    const [activeTab, setActiveTab] = useState("tasks");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="space-y-6" key={refreshKey}>
            <ProfileHeader user={user} onRefresh={handleRefresh} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    <ProfileInfoCard user={user} />
                    <ProfileChangePassword onRefresh={handleRefresh} />
                </div>

                {/* Right Column - Stats and Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <ProfileStats workload={workload} projectsCount={projects.length} />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="tasks">
                                My Tasks ({tasks.length})
                            </TabsTrigger>
                            <TabsTrigger value="projects">
                                My Projects ({projects.length})
                            </TabsTrigger>
                            <TabsTrigger value="activities">
                                Recent Activity ({activities.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tasks" className="space-y-4">
                            <ProfileTasksTab
                                userId={userId}
                                initialTasks={tasks}
                            />
                        </TabsContent>

                        <TabsContent value="projects" className="space-y-4">
                            <ProfileProjectsTab
                                projects={projects}
                            />
                        </TabsContent>

                        <TabsContent value="activities" className="space-y-4">
                            <ProfileActivitiesTab
                                activities={activities}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}