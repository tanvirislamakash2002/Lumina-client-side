"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectStats } from "./ProjectStats";
import { ProjectTasksTab } from "./ProjectTasksTab";
import { ProjectMembersTab } from "./ProjectMembersTab";
import { ProjectActivityTab } from "./ProjectActivityTab";

interface ProjectDetailsClientProps {
    project: any;
    members: any;
    tasks: any;
    activities: any;
    userRole: string;
    projectId: string;
}

export function ProjectDetailsClient({
    project,
    members,
    tasks,
    activities,
    userRole,
    projectId,
}: ProjectDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("tasks");

    const canEdit = userRole === "ADMIN" || userRole === "PROJECT_MANAGER";
    const isAdmin = userRole === "ADMIN";
    const isPM = userRole === "PROJECT_MANAGER";

    // Calculate days until deadline
    const daysUntilDeadline = Math.ceil(
        (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const isOverdue = daysUntilDeadline < 0 && project.status !== "COMPLETED";

    // Calculate progress
    const totalTasks = project.stats?.totalTasks || 0;
    const completedTasks = project.stats?.completedTasks || 0;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="space-y-6">
            {/* Project Header */}
            <ProjectHeader
                project={project}
                daysUntilDeadline={daysUntilDeadline}
                isOverdue={isOverdue}
                progress={progress}
                canEdit={canEdit}
                projectId={projectId}
            />

            {/* Stats Cards */}
            <ProjectStats
                totalTasks={project.stats?.totalTasks || 0}
                completedTasks={project.stats?.completedTasks || 0}
                memberCount={project.stats?.memberCount || 0}
                overdueTasks={project.stats?.overdueTasks || 0}
            />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 flex flex-col">
                <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks">
                    <ProjectTasksTab
                        tasks={tasks}
                        projectId={projectId}
                        canEdit={canEdit}
                        userRole={userRole}
                    />
                </TabsContent>

                <TabsContent value="members">
                    <ProjectMembersTab
                        members={members}
                        projectId={projectId}
                        canEdit={canEdit}
                        userRole={userRole}
                    />
                </TabsContent>

                <TabsContent value="activity">
                    <ProjectActivityTab activities={activities} />
                </TabsContent>
            </Tabs>
        </div>
    );
}