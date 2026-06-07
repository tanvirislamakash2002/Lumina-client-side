"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Palette, Shield } from "lucide-react";
import { NotificationSettings } from "./NotificationSettings";
import { ThemeSettings } from "./ThemeSettings";
import { SecuritySettings } from "./SecuritySettings";

interface SettingsClientProps {
    notificationSettings: any;
    themeSettings: any;
    securitySettings: any;
    isAdmin: boolean;
}

export function SettingsClient({
    notificationSettings,
    themeSettings,
    securitySettings,
    isAdmin,
}: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState("notifications");

    const tabs = [
        { value: "notifications", label: "Notifications", icon: Bell },
        { value: "appearance", label: "Appearance", icon: Palette },
        { value: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account preferences and settings.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                <TabsContent value="notifications" className="space-y-4">
                    <NotificationSettings initialSettings={notificationSettings} />
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4">
                    <ThemeSettings initialSettings={themeSettings} />
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <SecuritySettings initialSettings={securitySettings} />
                </TabsContent>
            </Tabs>
        </div>
    );
}