"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateGeneralSettings } from "@/actions/settings.action";
import { Loader2 } from "lucide-react";

interface GeneralSettingsProps {
    initialSettings: any;
}

export function GeneralSettings({ initialSettings }: GeneralSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: "Lumina",
        siteDescription: "Smart Project & Task Collaboration System",
        contactEmail: "support@lumina.com",
        timezone: "UTC",
        dateFormat: "MM/dd/yyyy",
    });

    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings);
        }
    }, [initialSettings]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const result = await updateGeneralSettings(settings);
            if (result.success) {
                toast.success("General settings saved successfully");
            } else {
                toast.error(result.message || "Failed to save settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const timezones = [
        "UTC", "America/New_York", "America/Los_Angeles", "Europe/London", 
        "Europe/Paris", "Asia/Tokyo", "Asia/Shanghai", "Asia/Dubai", "Australia/Sydney"
    ];

    const dateFormats = [
        { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
        { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
        { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                    Configure basic platform information and preferences.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Site Name */}
                <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        placeholder="Enter site name"
                    />
                    <p className="text-xs text-muted-foreground">
                        This appears in the browser tab and header.
                    </p>
                </div>

                {/* Site Description */}
                <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                        id="siteDescription"
                        value={settings.siteDescription}
                        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                        placeholder="Enter site description"
                        rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                        Used for SEO and meta descriptions.
                    </p>
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                        id="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        placeholder="contact@example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                        Public contact email for support inquiries.
                    </p>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                        value={settings.timezone}
                        onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {timezones.map((tz) => (
                                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        Default timezone for displaying dates and times.
                    </p>
                </div>

                {/* Date Format */}
                <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                        value={settings.dateFormat}
                        onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {dateFormats.map((format) => (
                                <SelectItem key={format.value} value={format.value}>
                                    {format.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        How dates are displayed throughout the platform.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save General Settings
                </Button>
            </CardFooter>
        </Card>
    );
}