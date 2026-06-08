"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUserHeader } from "./AdminUserHeader";
import { AdminUserStats } from "./AdminUserStats";
import { AdminUserProfileCard } from "./AdminUserProfileCard";
import { AdminUserTasksTab } from "./AdminUserTasksTab";
import { AdminUserProjectsTab } from "./AdminUserProjectsTab";
import { AdminUserActivitiesTab } from "./AdminUserActivitiesTab";
import { AdminUserSessionsTab } from "./AdminUserSessionsTab";
import { AdminUserDangerZone } from "./AdminUserDangerZone";

interface AdminUserDetailsClientProps {
    user: any;
    stats: any;
    tasks: any[];
    projects: any[];
    activities: any[];
    sessions: any[];
    isOwnProfile: boolean;
    currentUserId: string;
    userId: string;
}

export function AdminUserDetailsClient({
    user,
    stats,
    tasks,
    projects,
    activities,
    sessions,
    isOwnProfile,
    currentUserId,
    userId,
}: AdminUserDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("tasks");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
        router.refresh();
    };

    const tabs = [
        { value: "tasks", label: "Tasks", count: stats?.stats?.totalTasks || 0 },
        { value: "projects", label: "Projects", count: projects.length },
        { value: "activities", label: "Activities", count: activities.length },
        { value: "sessions", label: "Sessions", count: sessions.length },
    ];

    return (
        <div className="space-y-6" key={refreshKey}>
            <AdminUserHeader
                user={user}
                isOwnProfile={isOwnProfile}
                onRefresh={handleRefresh}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <AdminUserProfileCard
                        user={user}
                        isOwnProfile={isOwnProfile}
                        onRefresh={handleRefresh}
                    />
                    {!isOwnProfile && (
                        <AdminUserDangerZone
                            user={user}
                            onRefresh={handleRefresh}
                        />
                    )}
                </div>

                {/* Right Column - Stats and Tabs */}
                <div className="lg:col-span-2 space-y-6 min-w-0">
                    <AdminUserStats stats={stats} />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 w-full min-w-0 flex flex-col">
                        <TabsList className="flex flex-wrap">
                            {tabs.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value}>
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                                            {tab.count}
                                        </span>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="w-full overflow-hidden">
                            <TabsContent value="tasks" className="space-y-4 m-0">
                                <AdminUserTasksTab
                                    userId={userId}
                                    initialTasks={tasks}
                                    userName={user.name}
                                />
                            </TabsContent>

                            <TabsContent value="projects" className="space-y-4 m-0">
                                <AdminUserProjectsTab
                                    projects={projects}
                                />
                            </TabsContent>

                            <TabsContent value="activities" className="space-y-4 m-0">
                                <AdminUserActivitiesTab
                                    activities={activities}
                                />
                            </TabsContent>

                            <TabsContent value="sessions" className="space-y-4 m-0">
                                <AdminUserSessionsTab
                                    sessions={sessions}
                                    onRefresh={handleRefresh}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}