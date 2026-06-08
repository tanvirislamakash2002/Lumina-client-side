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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateSecuritySettings } from "@/actions/settings.action";

interface SecuritySettingsProps {
    initialSettings: any;
}

export function SecuritySettings({ initialSettings }: SecuritySettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        passwordMinLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecialChar: false,
        twoFactorEnabled: false,
        enforceTwoFactor: false,
        loginNotifications: true,
        maxLoginAttempts: 5,
        sessionTimeout: 60,
    });

    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings);
        }
    }, [initialSettings]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const result = await updateSecuritySettings(settings);
            if (result.success) {
                toast.success("Security settings saved successfully");
            } else {
                toast.error(result.message || "Failed to save settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                    Configure password policies and security requirements.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Password Requirements */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Password Requirements</h3>
                    
                    <div className="space-y-2">
                        <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                        <Input
                            id="passwordMinLength"
                            type="number"
                            min={6}
                            max={20}
                            value={settings.passwordMinLength}
                            onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) || 8 })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="requireUppercase">Require Uppercase Letter</Label>
                        <Switch
                            id="requireUppercase"
                            checked={settings.requireUppercase}
                            onCheckedChange={(checked) => setSettings({ ...settings, requireUppercase: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="requireLowercase">Require Lowercase Letter</Label>
                        <Switch
                            id="requireLowercase"
                            checked={settings.requireLowercase}
                            onCheckedChange={(checked) => setSettings({ ...settings, requireLowercase: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="requireNumber">Require Number</Label>
                        <Switch
                            id="requireNumber"
                            checked={settings.requireNumber}
                            onCheckedChange={(checked) => setSettings({ ...settings, requireNumber: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="requireSpecialChar">Require Special Character</Label>
                        <Switch
                            id="requireSpecialChar"
                            checked={settings.requireSpecialChar}
                            onCheckedChange={(checked) => setSettings({ ...settings, requireSpecialChar: checked })}
                        />
                    </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="twoFactorEnabled">Enable 2FA</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow users to set up two-factor authentication
                            </p>
                        </div>
                        <Switch
                            id="twoFactorEnabled"
                            checked={settings.twoFactorEnabled}
                            onCheckedChange={(checked) => setSettings({ ...settings, twoFactorEnabled: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="enforceTwoFactor">Enforce 2FA for All Users</Label>
                            <p className="text-sm text-muted-foreground">
                                Require all users to set up two-factor authentication
                            </p>
                        </div>
                        <Switch
                            id="enforceTwoFactor"
                            checked={settings.enforceTwoFactor}
                            onCheckedChange={(checked) => setSettings({ ...settings, enforceTwoFactor: checked })}
                            disabled={!settings.twoFactorEnabled}
                        />
                    </div>
                </div>

                {/* Login Security */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium">Login Security</h3>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="loginNotifications">Login Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Send email notifications for new logins
                            </p>
                        </div>
                        <Switch
                            id="loginNotifications"
                            checked={settings.loginNotifications}
                            onCheckedChange={(checked) => setSettings({ ...settings, loginNotifications: checked })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                        <Input
                            id="maxLoginAttempts"
                            type="number"
                            min={3}
                            max={10}
                            value={settings.maxLoginAttempts}
                            onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                        />
                        <p className="text-xs text-muted-foreground">
                            Number of failed attempts before account lockout (3-10)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Select
                            value={settings.sessionTimeout.toString()}
                            onValueChange={(value) => setSettings({ ...settings, sessionTimeout: parseInt(value) })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                                <SelectItem value="240">4 hours</SelectItem>
                                <SelectItem value="480">8 hours</SelectItem>
                                <SelectItem value="720">12 hours</SelectItem>
                                <SelectItem value="1440">24 hours</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Inactivity timeout for user sessions
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Security Settings
                </Button>
            </CardFooter>
        </Card>
    );
}