"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Palette, Shield } from "lucide-react";
import { MemberNotificationSettings } from "./MemberNotificationSettings";
import { MemberThemeSettings } from "./MemberThemeSettings";
import { MemberSecuritySettings } from "./MemberSecuritySettings";

interface MemberSettingsClientProps {
    notificationSettings: any;
    themeSettings: any;
    securitySettings: any;
}

export function MemberSettingsClient({
    notificationSettings,
    themeSettings,
    securitySettings,
}: MemberSettingsClientProps) {
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
                    Manage your account preferences and security settings.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 flex flex-col">
                <TabsList className="flex-wrap">
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

                <>
                    <TabsContent value="notifications" className="space-y-4">
                        <MemberNotificationSettings initialSettings={notificationSettings} />
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-4">
                        <MemberThemeSettings initialSettings={themeSettings} />
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                        <MemberSecuritySettings initialSettings={securitySettings} />
                    </TabsContent>
                </>
            </Tabs>
        </div>
    );
}