"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTaskHeader } from "./AdminTaskHeader";
import { AdminTaskInfoCard } from "./AdminTaskInfoCard";
import { AdminTaskComments } from "./AdminTaskComments";
import { AdminTaskAttachments } from "./AdminTaskAttachments";
import { AdminTaskActivities } from "./AdminTaskActivities";
import { AdminTaskSidebar } from "./AdminTaskSidebar";

interface AdminTaskDetailsClientProps {
    task: any;
    comments: any[];
    attachments: any[];
    activities: any[];
    taskId: string;
}

export function AdminTaskDetailsClient({
    task,
    comments,
    attachments,
    activities,
    taskId,
}: AdminTaskDetailsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("comments");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
        router.refresh();
    };

    return (
        <div className="space-y-6" key={refreshKey}>
            <AdminTaskHeader
                task={task}
                onRefresh={handleRefresh}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminTaskInfoCard task={task} />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 flex flex-col w-full">
                        <TabsList className="flex-wrap">
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
                                <AdminTaskComments
                                    comments={comments}
                                />
                            </TabsContent>

                            <TabsContent value="attachments" className="space-y-4">
                                <AdminTaskAttachments
                                    attachments={attachments}
                                />
                            </TabsContent>

                            <TabsContent value="activities" className="space-y-4">
                                <AdminTaskActivities
                                    activities={activities}
                                />
                            </TabsContent>
                        </>
                    </Tabs>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    <AdminTaskSidebar task={task} />
                </div>
            </div>
        </div>
    );
}