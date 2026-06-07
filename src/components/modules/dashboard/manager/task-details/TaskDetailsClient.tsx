"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskDetailsHeader } from "./TaskDetailsHeader";
import { TaskInfoCard } from "./TaskInfoCard";
import { TaskComments } from "./TaskComments";
import { TaskAttachments } from "./TaskAttachments";
import { TaskActivities } from "./TaskActivities";
import { TaskSidebar } from "./TaskSidebar";
import { DeleteTaskDialog } from "../tasks/DeleteTaskDialog";

interface TaskDetailsClientProps {
    task: any;
    comments: any[];
    attachments: any[];
    activities: any[];
    canEdit: boolean;
    canDelete: boolean;
    currentUserId: string;
    userRole: string;
    taskId: string;
}

export function TaskDetailsClient({
    task,
    comments,
    attachments,
    activities,
    canEdit,
    canDelete,
    currentUserId,
    userRole,
    taskId,
}: TaskDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("comments");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
        router.refresh();
    };

    const handleDeleteSuccess = () => {
        router.push("/dashboard/tasks");
        router.refresh();
    };

    return (
        <div className="space-y-6" key={refreshKey}>
            <TaskDetailsHeader
                task={task}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={() => router.push(`/dashboard/tasks/${taskId}/edit`)}
                onDelete={() => setDeleteDialogOpen(true)}
                onRefresh={handleRefresh}
                currentUserId={currentUserId}
                userRole={userRole}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <TaskInfoCard task={task} />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="comments">
                                Comments ({comments.length})
                            </TabsTrigger>
                            <TabsTrigger value="attachments">
                                Attachments ({attachments.length})
                            </TabsTrigger>
                            <TabsTrigger value="activities">
                                Activities ({activities.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="comments" className="space-y-4">
                            <TaskComments
                                taskId={taskId}
                                initialComments={comments}
                                currentUserId={currentUserId}
                                userRole={userRole}
                                onCommentUpdate={handleRefresh}
                            />
                        </TabsContent>

                        <TabsContent value="attachments" className="space-y-4">
                            <TaskAttachments
                                taskId={taskId}
                                initialAttachments={attachments}
                                canEdit={canEdit}
                                currentUserId={currentUserId}
                                userRole={userRole}
                                onAttachmentUpdate={handleRefresh}
                            />
                        </TabsContent>

                        <TabsContent value="activities" className="space-y-4">
                            <TaskActivities
                                taskId={taskId}
                                initialActivities={activities}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    <TaskSidebar
                        task={task}
                        canEdit={canEdit}
                        currentUserId={currentUserId}
                        userRole={userRole}
                        onTaskUpdate={handleRefresh}
                    />
                </div>
            </div>

            <DeleteTaskDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                task={task}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}