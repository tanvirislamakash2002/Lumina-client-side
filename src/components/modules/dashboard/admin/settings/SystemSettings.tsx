"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateSystemSettings } from "@/actions/settings.action";

interface SystemSettingsProps {
    initialSettings: any;
}

const allowedFileTypesOptions = [
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
    "application/pdf", "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
];

export function SystemSettings({ initialSettings }: SystemSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: false,
        defaultUserRole: "TEAM_MEMBER",
        maxProjectPerUser: 50,
        maxFileSize: 5,
        allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"],
    });
    const [newFileType, setNewFileType] = useState("");

    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings);
        }
    }, [initialSettings]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const result = await updateSystemSettings(settings);
            if (result.success) {
                toast.success("System settings saved successfully");
            } else {
                toast.error(result.message || "Failed to save settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const addFileType = () => {
        if (newFileType && !settings.allowedFileTypes.includes(newFileType)) {
            setSettings({
                ...settings,
                allowedFileTypes: [...settings.allowedFileTypes, newFileType]
            });
            setNewFileType("");
        }
    };

    const removeFileType = (fileType: string) => {
        setSettings({
            ...settings,
            allowedFileTypes: settings.allowedFileTypes.filter(ft => ft !== fileType)
        });
    };

    const getFileTypeLabel = (fileType: string) => {
        const labels: Record<string, string> = {
            "image/jpeg": "JPEG Image",
            "image/jpg": "JPEG Image",
            "image/png": "PNG Image",
            "image/gif": "GIF Image",
            "image/webp": "WebP Image",
            "application/pdf": "PDF Document",
            "application/msword": "Word Document",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word Document (DOCX)",
            "text/plain": "Text File",
        };
        return labels[fileType] || fileType;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                    Configure platform behavior and restrictions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Maintenance Mode */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                        <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                            When enabled, only admins can access the platform
                        </p>
                    </div>
                    <Switch
                        id="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                    />
                </div>

                {/* Allow Registration */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                        <Label htmlFor="allowRegistration">Allow New Registrations</Label>
                        <p className="text-sm text-muted-foreground">
                            Allow new users to create accounts
                        </p>
                    </div>
                    <Switch
                        id="allowRegistration"
                        checked={settings.allowRegistration}
                        onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                    />
                </div>

                {/* Require Email Verification */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                        <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                        <p className="text-sm text-muted-foreground">
                            New users must verify their email before accessing the platform
                        </p>
                    </div>
                    <Switch
                        id="requireEmailVerification"
                        checked={settings.requireEmailVerification}
                        onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                    />
                </div>

                {/* Default User Role */}
                <div className="space-y-2">
                    <Label htmlFor="defaultUserRole">Default User Role</Label>
                    <Select
                        value={settings.defaultUserRole}
                        onValueChange={(value) => setSettings({ ...settings, defaultUserRole: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                            <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        Role assigned to new users upon registration
                    </p>
                </div>

                {/* Max Projects Per User */}
                <div className="space-y-2">
                    <Label htmlFor="maxProjectPerUser">Max Projects Per User</Label>
                    <Input
                        id="maxProjectPerUser"
                        type="number"
                        min={1}
                        max={1000}
                        value={settings.maxProjectPerUser}
                        onChange={(e) => setSettings({ ...settings, maxProjectPerUser: parseInt(e.target.value) || 50 })}
                    />
                    <p className="text-xs text-muted-foreground">
                        Maximum number of projects a user can create (0 for unlimited)
                    </p>
                </div>

                {/* Max File Size */}
                <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                    <Input
                        id="maxFileSize"
                        type="number"
                        min={1}
                        max={50}
                        value={settings.maxFileSize}
                        onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) || 5 })}
                    />
                    <p className="text-xs text-muted-foreground">
                        Maximum file size for uploads (1-50 MB)
                    </p>
                </div>

                {/* Allowed File Types */}
                <div className="space-y-2">
                    <Label>Allowed File Types</Label>
                    <div className="flex gap-2">
                        <Select value={newFileType} onValueChange={setNewFileType}>
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select file type" />
                            </SelectTrigger>
                            <SelectContent>
                                {allowedFileTypesOptions
                                    .filter(ft => !settings.allowedFileTypes.includes(ft))
                                    .map((ft) => (
                                        <SelectItem key={ft} value={ft}>
                                            {getFileTypeLabel(ft)}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        <Button type="button" variant="outline" onClick={addFileType} disabled={!newFileType}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {settings.allowedFileTypes.map((ft) => (
                            <Badge key={ft} variant="secondary" className="gap-1">
                                {getFileTypeLabel(ft)}
                                <button
                                    type="button"
                                    onClick={() => removeFileType(ft)}
                                    className="ml-1 hover:text-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        File types that users can upload
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save System Settings
                </Button>
            </CardFooter>
        </Card>
    );
}