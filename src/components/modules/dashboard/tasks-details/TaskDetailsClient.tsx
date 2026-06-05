"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskHeader } from "./TaskHeader";
import { TaskInfoCard } from "./TaskInfoCard";
import { TaskStats } from "./TaskStats";
import { TaskCommentsTab } from "./TaskCommentsTab";
import { TaskAttachmentsTab } from "./TaskAttachmentsTab";
import { TaskActivityTab } from "./TaskActivityTab";

interface TaskDetailsClientProps {
    task: any;
    comments: any;
    attachments: any;
    activities: any;
    userRole: string;
    currentUserId: string;
}

export function TaskDetailsClient({
    task,
    comments,
    attachments,
    activities,
    userRole,
    currentUserId,
}: TaskDetailsClientProps) {
    const [activeTab, setActiveTab] = useState("comments");

    const canEdit = userRole === "ADMIN" || userRole === "PROJECT_MANAGER" || task.assignedTo?.id === currentUserId;
    const canDelete = userRole === "ADMIN" || userRole === "PROJECT_MANAGER";

    const stats = {
        commentCount: task.commentCount || 0,
        attachmentCount: task.attachmentCount || 0,
        activityCount: activities?.activities?.length || 0,
    };

    return (
        <div className="space-y-6">
            {/* Task Header */}
            <TaskHeader
                task={task}
                canEdit={canEdit}
                canDelete={canDelete}
                userRole={userRole}
                currentUserId={currentUserId}
            />

            {/* Task Info Card */}
            <TaskInfoCard task={task} />

            {/* Stats Cards */}
            <TaskStats stats={stats} />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="flex flex-col w-full">
                    <TabsList>
                        <TabsTrigger value="comments">
                            Comments ({stats.commentCount})
                        </TabsTrigger>
                        <TabsTrigger value="attachments">
                            Attachments ({stats.attachmentCount})
                        </TabsTrigger>
                        <TabsTrigger value="activity">
                            Activity ({stats.activityCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="comments">
                        <TaskCommentsTab
                            comments={comments}
                            taskId={task.id}
                            userRole={userRole}
                            currentUserId={currentUserId}
                        />
                    </TabsContent>
                </div>

                <TabsContent value="attachments">
                    <TaskAttachmentsTab
                        attachments={attachments}
                        taskId={task.id}
                        userRole={userRole}
                        currentUserId={currentUserId}
                    />
                </TabsContent>

                <TabsContent value="activity">
                    <TaskActivityTab activities={activities} />
                </TabsContent>
            </Tabs>
        </div>
    );
}