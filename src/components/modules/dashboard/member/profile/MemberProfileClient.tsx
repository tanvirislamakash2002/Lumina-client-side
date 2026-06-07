"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberProfileHeader } from "./MemberProfileHeader";
import { MemberProfileStats } from "./MemberProfileStats";
import { MemberProfileInfoCard } from "./MemberProfileInfoCard";
import { MemberProfileTasksTab } from "./MemberProfileTasksTab";
import { MemberProfileProjectsTab } from "./MemberProfileProjectsTab";
import { MemberProfileActivitiesTab } from "./MemberProfileActivitiesTab";

interface MemberProfileClientProps {
    user: any;
    workload: any;
    tasks: any[];
    projects: any[];
    activities: any[];
    userId: string;
}

export function MemberProfileClient({
    user,
    workload,
    tasks,
    projects,
    activities,
    userId,
}: MemberProfileClientProps) {
    const [activeTab, setActiveTab] = useState("tasks");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="space-y-6" key={refreshKey}>
            <MemberProfileHeader user={user} onRefresh={handleRefresh} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    <MemberProfileInfoCard user={user} onRefresh={handleRefresh} />
                </div>

                {/* Right Column - Stats and Tabs */}
                <div className="lg:col-span-2 space-y-6 min-w-0">
                    <MemberProfileStats workload={workload} projectsCount={projects.length} />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 w-full min-w-0 flex flex-col">
                        <TabsList className="flex flex-wrap">
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

                        <div className="w-full overflow-hidden">
                            <TabsContent value="tasks" className="space-y-4 m-0">
                                <MemberProfileTasksTab
                                    userId={userId}
                                    initialTasks={tasks}
                                />
                            </TabsContent>

                            <TabsContent value="projects" className="space-y-4 m-0">
                                <MemberProfileProjectsTab
                                    projects={projects}
                                />
                            </TabsContent>

                            <TabsContent value="activities" className="space-y-4 m-0">
                                <MemberProfileActivitiesTab
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