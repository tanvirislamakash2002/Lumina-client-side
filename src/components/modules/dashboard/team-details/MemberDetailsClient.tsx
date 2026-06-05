"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberProfileHeader } from "./MemberProfileHeader";
import { MemberStats } from "./MemberStats";
import { MemberTasksTab } from "./MemberTasksTab";
import { MemberProjectsTab } from "./MemberProjectsTab";
import { MemberActivityTab } from "./MemberActivityTab";

interface MemberDetailsClientProps {
    user: any;
    tasks: any[];
    projects: any[];
    activities: any;
    canChangeRole: boolean;
    currentUserId: string;
}

export function MemberDetailsClient({
    user,
    tasks,
    projects,
    activities,
    canChangeRole,
    currentUserId,
}: MemberDetailsClientProps) {
    const [activeTab, setActiveTab] = useState("tasks");

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const projectsCount = projects.length;

    const isOwnProfile = user.id === currentUserId;

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <MemberProfileHeader
                user={user}
                canChangeRole={canChangeRole}
                isOwnProfile={isOwnProfile}
            />

            {/* Stats Cards */}
            <MemberStats
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                completionRate={completionRate}
                projectsCount={projectsCount}
            />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 flex flex-col">
                <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks">
                    <MemberTasksTab tasks={tasks} />
                </TabsContent>

                <TabsContent value="projects">
                    <MemberProjectsTab projects={projects} />
                </TabsContent>

                <TabsContent value="activity">
                    <MemberActivityTab activities={activities} />
                </TabsContent>
            </Tabs>
        </div>
    );
}