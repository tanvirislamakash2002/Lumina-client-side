"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Loader2, Sun, Moon, Monitor } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { updateThemeSettings } from "@/actions/settings.action";

interface ThemeTabProps {
    initialData: any;
}

export function ThemeTab({ initialData }: ThemeTabProps) {
    const { theme: currentTheme, setTheme } = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(initialData?.sidebarCollapsed ?? false);
    const [fontSize, setFontSize] = useState(initialData?.fontSize ?? "medium");
    const [compactView, setCompactView] = useState(initialData?.compactView ?? false);

    const handleThemeChange = async (value: string) => {
        setIsSubmitting(true);
        setTheme(value);

        const result = await updateThemeSettings({
            theme: value as "light" | "dark" | "system",
            sidebarCollapsed,
            fontSize: fontSize as "small" | "medium" | "large",
            compactView,
        });

        if (!result.success) {
            toast.error("Failed to save theme preference");
        }
        setIsSubmitting(false);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Saving theme settings...");

        const result = await updateThemeSettings({
            theme: currentTheme as "light" | "dark" | "system",
            sidebarCollapsed,
            fontSize: fontSize as "small" | "medium" | "large",
            compactView,
        });

        if (result.success) {
            toast.success("Theme settings saved", { id: toastId });
        } else {
            toast.error(result.message || "Failed to save settings", { id: toastId });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Theme Preferences</CardTitle>
                <CardDescription>
                    Customize how Lumina looks and feels
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Theme Selection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme Mode</h3>
                    <RadioGroup
                        value={currentTheme}
                        onValueChange={handleThemeChange}
                        className="grid grid-cols-3 gap-4"
                    >
                        <div>
                            <RadioGroupItem value="light" id="light" className="peer sr-only" />
                            <Label
                                htmlFor="light"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-indigo-600 [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
                            >
                                <Sun className="mb-3 h-6 w-6" />
                                Light
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                            <Label
                                htmlFor="dark"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-indigo-600 [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
                            >
                                <Moon className="mb-3 h-6 w-6" />
                                Dark
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="system" id="system" className="peer sr-only" />
                            <Label
                                htmlFor="system"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-indigo-600 [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
                            >
                                <Monitor className="mb-3 h-6 w-6" />
                                System
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Font Size */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Font Size</h3>
                    <RadioGroup
                        value={fontSize}
                        onValueChange={setFontSize}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="small" id="small" />
                            <Label htmlFor="small" className="text-sm">Small</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium" className="text-base">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="large" id="large" />
                            <Label htmlFor="large" className="text-lg">Large</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Layout Preferences */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Layout</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="sidebarCollapsed">Sidebar Collapsed by Default</Label>
                                <p className="text-sm text-muted-foreground">
                                    Start with the sidebar minimized
                                </p>
                            </div>
                            <Switch
                                id="sidebarCollapsed"
                                checked={sidebarCollapsed}
                                onCheckedChange={setSidebarCollapsed}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="compactView">Compact View</Label>
                                <p className="text-sm text-muted-foreground">
                                    Reduce spacing between elements
                                </p>
                            </div>
                            <Switch
                                id="compactView"
                                checked={compactView}
                                onCheckedChange={setCompactView}
                            />
                        </div>
                    </div>
                </div>

                <Button onClick={handleSave} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}