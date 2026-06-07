"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberProjectHeader } from "./MemberProjectHeader";
import { MemberProjectStats } from "./MemberProjectStats";
import { MemberProjectTasksTab } from "./MemberProjectTasksTab";
import { MemberProjectMembersTab } from "./MemberProjectMembersTab";
import { MemberProjectActivitiesTab } from "./MemberProjectActivitiesTab";

interface MemberProjectDetailsClientProps {
    project: any;
    stats: any;
    members: any[];
    tasks: any[];
    activities: any[];
    currentUser: any;
    isTeamMember: boolean;
    projectId: string;
}

export function MemberProjectDetailsClient({
    project,
    stats,
    members,
    tasks,
    activities,
    currentUser,
    isTeamMember,
    projectId,
}: MemberProjectDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("tasks");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
        router.refresh();
    };

    return (
        <div className="space-y-6" key={refreshKey}>
            <MemberProjectHeader
                project={project}
                onRefresh={handleRefresh}
            />

            <MemberProjectStats stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 flex flex-col">
                <TabsList className="flex flex-wrap">
                    <TabsTrigger value="tasks">
                        Tasks ({stats?.totalTasks || 0})
                    </TabsTrigger>
                    <TabsTrigger value="members">
                        Members ({members.length})
                    </TabsTrigger>
                    <TabsTrigger value="activities">
                        Activities ({activities.length})
                    </TabsTrigger>
                </TabsList>
                <>
                    <TabsContent value="tasks" className="space-y-4">
                        <MemberProjectTasksTab
                            projectId={projectId}
                            initialTasks={tasks}
                            currentUser={currentUser}
                            onTaskUpdate={handleRefresh}
                        />
                    </TabsContent>

                    <TabsContent value="members" className="space-y-4">
                        <MemberProjectMembersTab
                            members={members}
                        />
                    </TabsContent>

                    <TabsContent value="activities" className="space-y-4">
                        <MemberProjectActivitiesTab
                            projectId={projectId}
                            initialActivities={activities}
                        />
                    </TabsContent>
                </>
            </Tabs>
        </div>
    );
}