"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateSecuritySettings, getSessions, revokeSession, revokeAllSessions } from "@/actions/settings.action";
import { Loader2, Smartphone, Laptop, Globe, LogOut } from "lucide-react";
import { format } from "date-fns";

interface SecuritySettingsProps {
    initialSettings: any;
}

interface SecuritySettingsState {
    twoFactorEnabled: boolean;
    sessionTimeout: string;  // Keep as string for Select component
    loginNotifications: boolean;
}

interface Session {
    id: string;
    userAgent: string;
    ipAddress: string;
    createdAt: string;
    expiresAt: string;
    isCurrent: boolean;
}

export function SecuritySettings({ initialSettings }: SecuritySettingsProps) {
    const [settings, setSettings] = useState<SecuritySettingsState>({
        twoFactorEnabled: false,
        sessionTimeout: "60",
        loginNotifications: true,
    });
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRevoking, setIsRevoking] = useState(false);

    useEffect(() => {
        if (initialSettings) {
            setSettings({
                twoFactorEnabled: initialSettings.twoFactorEnabled ?? false,
                sessionTimeout: String(initialSettings.sessionTimeout ?? 60),
                loginNotifications: initialSettings.loginNotifications ?? true,
            });
        }
        loadSessions();
    }, [initialSettings]);

    const loadSessions = async () => {
        setIsLoadingSessions(true);
        try {
            const result = await getSessions();
            if (result.success) {
                setSessions(result.data || []);
            }
        } catch (error) {
            console.error("Failed to load sessions:", error);
        } finally {
            setIsLoadingSessions(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Convert sessionTimeout from string to number before sending
            const payload = {
                twoFactorEnabled: settings.twoFactorEnabled,
                sessionTimeout: parseInt(settings.sessionTimeout, 10),
                loginNotifications: settings.loginNotifications,
            };
            const result = await updateSecuritySettings(payload);
            if (result.success) {
                toast.success("Security settings saved successfully");
            } else {
                toast.error(result.message || "Failed to save settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRevokeSession = async (sessionId: string) => {
        if (!confirm("Are you sure you want to revoke this session? You will be logged out from that device.")) return;

        setIsRevoking(true);
        try {
            const result = await revokeSession(sessionId);
            if (result.success) {
                toast.success("Session revoked successfully");
                loadSessions();
            } else {
                toast.error(result.message || "Failed to revoke session");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsRevoking(false);
        }
    };

    const handleRevokeAllSessions = async () => {
        if (!confirm("Are you sure you want to revoke all other sessions? You will be logged out from all other devices.")) return;

        setIsRevoking(true);
        try {
            const result = await revokeAllSessions();
            if (result.success) {
                toast.success("All other sessions revoked successfully");
                loadSessions();
            } else {
                toast.error(result.message || "Failed to revoke sessions");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsRevoking(false);
        }
    };

    const getDeviceIcon = (userAgent: string) => {
        if (userAgent.toLowerCase().includes("mobile")) return Smartphone;
        if (userAgent.toLowerCase().includes("windows") || userAgent.toLowerCase().includes("mac")) return Laptop;
        return Globe;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                    Manage your account security and active sessions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="twoFactorEnabled">Enable 2FA</Label>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                        <Switch
                            id="twoFactorEnabled"
                            checked={settings.twoFactorEnabled}
                            onCheckedChange={(checked) => setSettings({ ...settings, twoFactorEnabled: checked })}
                        />
                    </div>
                </div>

                <Separator />

                {/* Session Timeout */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Session Timeout</h3>
                    <Select
                        value={settings.sessionTimeout}
                        onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                            <SelectItem value="480">8 hours</SelectItem>
                            <SelectItem value="1440">24 hours</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                        Automatically log out after period of inactivity
                    </p>
                </div>

                <Separator />

                {/* Login Notifications */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Login Alerts</h3>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="loginNotifications">Login Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive email when a new device logs into your account
                            </p>
                        </div>
                        <Switch
                            id="loginNotifications"
                            checked={settings.loginNotifications}
                            onCheckedChange={(checked) => setSettings({ ...settings, loginNotifications: checked })}
                        />
                    </div>
                </div>

                <Separator />

                {/* Active Sessions */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Active Sessions</h3>
                        {sessions.filter(s => !s.isCurrent).length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRevokeAllSessions}
                                disabled={isRevoking}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Revoke All Others
                            </Button>
                        )}
                    </div>
                    <div className="space-y-3">
                        {isLoadingSessions ? (
                            <div className="text-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                            </div>
                        ) : sessions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No active sessions found.
                            </p>
                        ) : (
                            sessions.map((session) => {
                                const DeviceIcon = getDeviceIcon(session.userAgent);
                                return (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-3 rounded-lg border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-muted">
                                                <DeviceIcon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {session.userAgent}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-muted-foreground">
                                                        IP: {session.ipAddress}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <p className="text-xs text-muted-foreground">
                                                        Started: {format(new Date(session.createdAt), "MMM dd, h:mm a")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {session.isCurrent && (
                                                <Badge variant="secondary">Current Session</Badge>
                                            )}
                                            {!session.isCurrent && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRevokeSession(session.id)}
                                                    disabled={isRevoking}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Revoke
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
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
                    Save Security Settings
                </Button>
            </CardFooter>
        </Card>
    );
}