"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsHeader } from "./SettingsHeader";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { ThemeTab } from "./tabs/ThemeTab";
import { SecurityTab } from "./tabs/SecurityTab";
import { SessionsTab } from "./tabs/SessionsTab";
import { GeneralTab } from "./tabs/GeneralTab";
import { SystemTab } from "./tabs/SystemTab";

interface SettingsClientProps {
    userRole: string;
    currentUserId: string;
    notifications: any;
    theme: any;
    security: any;
    sessions: any;
    general: any;
    system: any;
}

export function SettingsClient({
    userRole,
    currentUserId,
    notifications,
    theme,
    security,
    sessions,
    general,
    system,
}: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState("notifications");

    const isAdmin = userRole === "ADMIN";

    return (
        <div className="space-y-6">
            <SettingsHeader />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 flex flex-col">
                <Card>
                    <CardHeader>
                        <TabsList className="flex flex-wrap h-auto gap-2">
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            <TabsTrigger value="theme">Theme</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="sessions">Sessions</TabsTrigger>
                            {isAdmin && (
                                <>
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="system">System</TabsTrigger>
                                </>
                            )}
                        </TabsList>
                    </CardHeader>
                </Card>
                <div>

                    <TabsContent value="notifications">
                        <NotificationsTab initialData={notifications} />
                    </TabsContent>

                    <TabsContent value="theme">
                        <ThemeTab initialData={theme} />
                    </TabsContent>

                    <TabsContent value="security">
                        <SecurityTab initialData={security} />
                    </TabsContent>

                    <TabsContent value="sessions">
                        <SessionsTab initialData={sessions} currentUserId={currentUserId} />
                    </TabsContent>

                    {isAdmin && (
                        <>
                            <TabsContent value="general">
                                <GeneralTab initialData={general} />
                            </TabsContent>
                            <TabsContent value="system">
                                <SystemTab initialData={system} />
                            </TabsContent>
                        </>
                    )}
                </div>
            </Tabs>
        </div>
    );
}