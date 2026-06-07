"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { updateNotificationSettings } from "@/actions/settings.action";
import { Loader2 } from "lucide-react";

interface NotificationSettingsProps {
    initialSettings: any;
}

export function NotificationSettings({ initialSettings }: NotificationSettingsProps) {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        taskAssigned: true,
        taskStatusChanged: true,
        taskDueSoon: true,
        taskOverdue: true,
        commentAdded: true,
        mentioned: true,
        projectInvite: true,
        weeklyDigest: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings);
        }
    }, [initialSettings]);

    const handleToggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateNotificationSettings(settings);
            if (result.success) {
                toast.success("Notification settings saved successfully");
            } else {
                toast.error(result.message || "Failed to save settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                    Choose what notifications you want to receive.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Email & Push */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Delivery Methods</h3>
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
                                checked={settings.emailNotifications}
                                onCheckedChange={() => handleToggle("emailNotifications")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="pushNotifications">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive notifications in browser
                                </p>
                            </div>
                            <Switch
                                id="pushNotifications"
                                checked={settings.pushNotifications}
                                onCheckedChange={() => handleToggle("pushNotifications")}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Task Events */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Task Events</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="taskAssigned">Task Assigned</Label>
                                <p className="text-sm text-muted-foreground">
                                    When a task is assigned to you
                                </p>
                            </div>
                            <Switch
                                id="taskAssigned"
                                checked={settings.taskAssigned}
                                onCheckedChange={() => handleToggle("taskAssigned")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="taskStatusChanged">Task Status Changed</Label>
                                <p className="text-sm text-muted-foreground">
                                    When a task you're assigned to changes status
                                </p>
                            </div>
                            <Switch
                                id="taskStatusChanged"
                                checked={settings.taskStatusChanged}
                                onCheckedChange={() => handleToggle("taskStatusChanged")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="taskDueSoon">Task Due Soon</Label>
                                <p className="text-sm text-muted-foreground">
                                    When a task is due within 24 hours
                                </p>
                            </div>
                            <Switch
                                id="taskDueSoon"
                                checked={settings.taskDueSoon}
                                onCheckedChange={() => handleToggle("taskDueSoon")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="taskOverdue">Task Overdue</Label>
                                <p className="text-sm text-muted-foreground">
                                    When a task becomes overdue
                                </p>
                            </div>
                            <Switch
                                id="taskOverdue"
                                checked={settings.taskOverdue}
                                onCheckedChange={() => handleToggle("taskOverdue")}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Collaboration Events */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Collaboration</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="commentAdded">Comment Added</Label>
                                <p className="text-sm text-muted-foreground">
                                    When someone comments on your task
                                </p>
                            </div>
                            <Switch
                                id="commentAdded"
                                checked={settings.commentAdded}
                                onCheckedChange={() => handleToggle("commentAdded")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="mentioned">Mentions</Label>
                                <p className="text-sm text-muted-foreground">
                                    When someone mentions you in a comment
                                </p>
                            </div>
                            <Switch
                                id="mentioned"
                                checked={settings.mentioned}
                                onCheckedChange={() => handleToggle("mentioned")}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="projectInvite">Project Invites</Label>
                                <p className="text-sm text-muted-foreground">
                                    When you're added to a new project
                                </p>
                            </div>
                            <Switch
                                id="projectInvite"
                                checked={settings.projectInvite}
                                onCheckedChange={() => handleToggle("projectInvite")}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Digest */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Digest</h3>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive a weekly summary of your activity
                            </p>
                        </div>
                        <Switch
                            id="weeklyDigest"
                            checked={settings.weeklyDigest}
                            onCheckedChange={() => handleToggle("weeklyDigest")}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Notification Settings
                </Button>
            </CardFooter>
        </Card>
    );
}