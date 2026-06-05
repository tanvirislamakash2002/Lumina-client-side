"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { updateNotificationSettings } from "@/actions/settings.action";

const notificationsSchema = z.object({
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    taskAssigned: z.boolean(),
    taskStatusChanged: z.boolean(),
    taskDueSoon: z.boolean(),
    taskOverdue: z.boolean(),
    commentAdded: z.boolean(),
    mentioned: z.boolean(),
    projectInvite: z.boolean(),
    weeklyDigest: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsSchema>;

interface NotificationsTabProps {
    initialData: any;
}

export function NotificationsTab({ initialData }: NotificationsTabProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, watch } = useForm<NotificationsFormValues>({
        resolver: zodResolver(notificationsSchema),
        defaultValues: {
            emailNotifications: initialData?.emailNotifications ?? true,
            pushNotifications: initialData?.pushNotifications ?? true,
            taskAssigned: initialData?.taskAssigned ?? true,
            taskStatusChanged: initialData?.taskStatusChanged ?? true,
            taskDueSoon: initialData?.taskDueSoon ?? true,
            taskOverdue: initialData?.taskOverdue ?? true,
            commentAdded: initialData?.commentAdded ?? true,
            mentioned: initialData?.mentioned ?? true,
            projectInvite: initialData?.projectInvite ?? true,
            weeklyDigest: initialData?.weeklyDigest ?? false,
        },
    });

    const emailNotifications = watch("emailNotifications");

    const onSubmit = async (data: NotificationsFormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Saving notification settings...");

        const result = await updateNotificationSettings(data);

        if (result.success) {
            toast.success("Notification settings saved", { id: toastId });
        } else {
            toast.error(result.message || "Failed to save settings", { id: toastId });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                    Choose what notifications you want to receive
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Notification Channels */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Channels</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications via email
                                    </p>
                                </div>
                                <Switch
                                    id="emailNotifications"
                                    {...register("emailNotifications")}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications in the app
                                    </p>
                                </div>
                                <Switch
                                    id="pushNotifications"
                                    {...register("pushNotifications")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email Notification Events */}
                    {emailNotifications && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Email Events</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="taskAssigned">Task Assignment</Label>
                                    <Switch id="taskAssigned" {...register("taskAssigned")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="taskStatusChanged">Task Status Changes</Label>
                                    <Switch id="taskStatusChanged" {...register("taskStatusChanged")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="taskDueSoon">Task Due Soon</Label>
                                    <Switch id="taskDueSoon" {...register("taskDueSoon")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="taskOverdue">Task Overdue</Label>
                                    <Switch id="taskOverdue" {...register("taskOverdue")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="commentAdded">New Comments</Label>
                                    <Switch id="commentAdded" {...register("commentAdded")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="mentioned">Mentions</Label>
                                    <Switch id="mentioned" {...register("mentioned")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="projectInvite">Project Invites</Label>
                                    <Switch id="projectInvite" {...register("projectInvite")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                                    <Switch id="weeklyDigest" {...register("weeklyDigest")} />
                                </div>
                            </div>
                        </div>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}