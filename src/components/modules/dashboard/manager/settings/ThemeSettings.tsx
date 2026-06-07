"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateThemeSettings } from "@/actions/settings.action";
import { Loader2, Sun, Moon, Monitor } from "lucide-react";

interface ThemeSettingsProps {
    initialSettings: any;
}

interface ThemeSettingsState {
    theme: "light" | "dark" | "system";
    sidebarCollapsed: boolean;
    fontSize: "small" | "medium" | "large";
    compactView: boolean;
}

export function ThemeSettings({ initialSettings }: ThemeSettingsProps) {
    const [settings, setSettings] = useState<ThemeSettingsState>({
        theme: "light",
        sidebarCollapsed: false,
        fontSize: "medium",
        compactView: false,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialSettings) {
            setSettings({
                theme: initialSettings.theme || "light",
                sidebarCollapsed: initialSettings.sidebarCollapsed || false,
                fontSize: initialSettings.fontSize || "medium",
                compactView: initialSettings.compactView || false,
            });
        }
    }, [initialSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateThemeSettings(settings);
            if (result.success) {
                toast.success("Theme settings saved successfully");
                // Apply theme immediately
                if (settings.theme === "dark") {
                    document.documentElement.classList.add("dark");
                } else if (settings.theme === "light") {
                    document.documentElement.classList.remove("dark");
                } else {
                    // System preference
                    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                        document.documentElement.classList.add("dark");
                    } else {
                        document.documentElement.classList.remove("dark");
                    }
                }
            } else {
                toast.error(result.message || "Failed to save settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const themeOptions = [
        { value: "light" as const, label: "Light", icon: Sun },
        { value: "dark" as const, label: "Dark", icon: Moon },
        { value: "system" as const, label: "System", icon: Monitor },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                    Customize how Lumina looks and feels.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Theme</h3>
                    <RadioGroup
                        value={settings.theme}
                        onValueChange={(value: "light" | "dark" | "system") => setSettings({ ...settings, theme: value })}
                        className="flex gap-4"
                    >
                        {themeOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                                        <Icon className="h-4 w-4" />
                                        {option.label}
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>

                {/* Font Size */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Font Size</h3>
                    <Select
                        value={settings.fontSize}
                        onValueChange={(value: "small" | "medium" | "large") => setSettings({ ...settings, fontSize: value })}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                        Preview: {settings.fontSize === "small" ? "Small text example" : settings.fontSize === "large" ? "Large text example" : "Medium text example"}
                    </div>
                </div>

                {/* Sidebar Behavior */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Sidebar</h3>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="sidebarCollapsed">Collapsed by Default</Label>
                            <p className="text-sm text-muted-foreground">
                                Start with sidebar collapsed, expand on hover
                            </p>
                        </div>
                        <Switch
                            id="sidebarCollapsed"
                            checked={settings.sidebarCollapsed}
                            onCheckedChange={(checked: boolean) => setSettings({ ...settings, sidebarCollapsed: checked })}
                        />
                    </div>
                </div>

                {/* Compact View */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Layout Density</h3>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="compactView">Compact View</Label>
                            <p className="text-sm text-muted-foreground">
                                Reduce padding and spacing for denser information display
                            </p>
                        </div>
                        <Switch
                            id="compactView"
                            checked={settings.compactView}
                            onCheckedChange={(checked: boolean) => setSettings({ ...settings, compactView: checked })}
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
                    Save Appearance Settings
                </Button>
            </CardFooter>
        </Card>
    );
}