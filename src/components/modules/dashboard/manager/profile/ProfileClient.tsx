"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { ProfileTasksTab } from "./ProfileTasksTab";
import { ProfileProjectsTab } from "./ProfileProjectsTab";
import { ProfileActivitiesTab } from "./ProfileActivitiesTab";
import { ProfileChangePasswordModal } from "./ProfileChangePasswordModal";

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
                </div>

                <div className="lg:col-span-2 space-y-6 min-w-0">  {/* Add min-w-0 */}
                    <ProfileStats workload={workload} projectsCount={projects.length} />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 w-full min-w-0 flex flex-col">  {/* Add min-w-0 */}
                        <TabsList className="flex flex-wrap">  {/* Allow tabs to wrap on mobile */}
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

                        <div className="w-full overflow-x-auto">  {/* Change overflow-hidden to overflow-x-auto */}
                            <TabsContent value="tasks" className="space-y-4 m-0">
                                <ProfileTasksTab userId={userId} initialTasks={tasks} />
                            </TabsContent>

                            <TabsContent value="projects" className="space-y-4 m-0">
                                <ProfileProjectsTab
                                    projects={projects}
                                />
                            </TabsContent>

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

