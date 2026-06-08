"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Mail, Database, AlertTriangle } from "lucide-react";
import { GeneralSettings } from "./GeneralSettings";
import { SystemSettings } from "./SystemSettings";
import { SecuritySettings } from "./SecuritySettings";
import { EmailSettings } from "./EmailSettings";
import { DangerZone } from "./DangerZone";

interface AdminSettingsClientProps {
    generalSettings: any;
    systemSettings: any;
    securitySettings: any;
}

export function AdminSettingsClient({
    generalSettings,
    systemSettings,
    securitySettings,
}: AdminSettingsClientProps) {
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { value: "general", label: "General", icon: Settings },
        { value: "system", label: "System", icon: Database },
        { value: "security", label: "Security", icon: Shield },
        { value: "email", label: "Email", icon: Mail },
        { value: "danger", label: "Danger Zone", icon: AlertTriangle },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Configure platform-wide settings and preferences.
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
                    <TabsContent value="general" className="space-y-4">
                        <GeneralSettings initialSettings={generalSettings} />
                    </TabsContent>

                    <TabsContent value="system" className="space-y-4">
                        <SystemSettings initialSettings={systemSettings} />
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                        <SecuritySettings initialSettings={securitySettings} />
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4">
                        <EmailSettings />
                    </TabsContent>

                    <TabsContent value="danger" className="space-y-4">
                        <DangerZone />
                    </TabsContent>
                </>
            </Tabs>
        </div>
    );
}