"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberTaskHeader } from "./MemberTaskHeader";
import { MemberTaskInfoCard } from "./MemberTaskInfoCard";
import { MemberTaskComments } from "./MemberTaskComments";
import { MemberTaskAttachments } from "./MemberTaskAttachments";
import { MemberTaskActivities } from "./MemberTaskActivities";
import { MemberTaskSidebar } from "./MemberTaskSidebar";

interface MemberTaskDetailsClientProps {
    task: any;
    comments: any[];
    attachments: any[];
    activities: any[];
    currentUserId: string;
    taskId: string;
}

export function MemberTaskDetailsClient({
    task,
    comments,
    attachments,
    activities,
    currentUserId,
    taskId,
}: MemberTaskDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("comments");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
        router.refresh();
    };

    return (
        <div className="space-y-6" key={refreshKey}>
            <MemberTaskHeader
                task={task}
                currentUserId={currentUserId}
                onRefresh={handleRefresh}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <MemberTaskInfoCard task={task} />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 flex flex-col">
                        <TabsList className="flex flex-wrap">
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
                        <>
                            <TabsContent value="comments" className="space-y-4">
                                <MemberTaskComments
                                    taskId={taskId}
                                    initialComments={comments}
                                    currentUserId={currentUserId}
                                    onCommentUpdate={handleRefresh}
                                />
                            </TabsContent>

                            <TabsContent value="attachments" className="space-y-4">
                                <MemberTaskAttachments
                                    taskId={taskId}
                                    initialAttachments={attachments}
                                    currentUserId={currentUserId}
                                    onAttachmentUpdate={handleRefresh}
                                />
                            </TabsContent>

                            <TabsContent value="activities" className="space-y-4">
                                <MemberTaskActivities
                                    initialActivities={activities}
                                />
                            </TabsContent>
                        </>
                    </Tabs>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    <MemberTaskSidebar
                        task={task}
                        currentUserId={currentUserId}
                        onTaskUpdate={handleRefresh}
                    />
                </div>
            </div>
        </div>
    );
}