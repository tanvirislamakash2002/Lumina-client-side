"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateSecuritySettings, getSessions, revokeSession, revokeAllSessions } from "@/actions/settings.action";
import { changePassword } from "@/actions/user.action";
import { Loader2, Smartphone, Laptop, Globe, LogOut, Key, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

interface MemberSecuritySettingsProps {
    initialSettings: any;
}

interface Session {
    id: string;
    userAgent: string;
    ipAddress: string;
    createdAt: string;
    expiresAt: string;
    isCurrent: boolean;
}

export function MemberSecuritySettings({ initialSettings }: MemberSecuritySettingsProps) {
    const [settings, setSettings] = useState({
        loginNotifications: true,
    });
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRevoking, setIsRevoking] = useState(false);
    
    // Password change modal state
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (initialSettings) {
            setSettings({
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
            const result = await updateSecuritySettings(settings);
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

    const validatePasswordForm = () => {
        let isValid = true;
        const newErrors = { currentPassword: "", newPassword: "", confirmPassword: "" };

        if (!passwordForm.currentPassword) {
            newErrors.currentPassword = "Current password is required";
            isValid = false;
        }

        if (!passwordForm.newPassword) {
            newErrors.newPassword = "New password is required";
            isValid = false;
        } else if (passwordForm.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!passwordForm.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setPasswordErrors(newErrors);
        return isValid;
    };

    const handlePasswordChange = async () => {
        if (!validatePasswordForm()) return;

        setIsChangingPassword(true);
        try {
            const result = await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword,
            });

            if (result.success) {
                toast.success("Password changed successfully");
                setPasswordModalOpen(false);
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(result.message || "Failed to change password");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const resetPasswordForm = () => {
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setPasswordErrors({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const getDeviceIcon = (userAgent: string) => {
        if (userAgent.toLowerCase().includes("mobile")) return Smartphone;
        if (userAgent.toLowerCase().includes("windows") || userAgent.toLowerCase().includes("mac")) return Laptop;
        return Globe;
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                        Manage your password and active sessions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Change Password */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Password</h3>
                        <Dialog open={passwordModalOpen} onOpenChange={(open) => {
                            setPasswordModalOpen(open);
                            if (!open) resetPasswordForm();
                        }}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Key className="h-4 w-4" />
                                    Change Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                    <DialogDescription>
                                        Update your password to keep your account secure.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="currentPassword"
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                className={passwordErrors.currentPassword ? "border-red-500" : ""}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.currentPassword && <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                className={passwordErrors.newPassword ? "border-red-500" : ""}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.newPassword && <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>}
                                        <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.confirmPassword && <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setPasswordModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handlePasswordChange} disabled={isChangingPassword} className="bg-indigo-600 hover:bg-indigo-700">
                                        {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Password
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                        <div className="flex items-center justify-between flex-wrap gap-2">
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
                                        <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-muted">
                                                    <DeviceIcon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {session.userAgent}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <p className="text-xs text-muted-foreground">
                                                            IP: {session.ipAddress}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
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
        </>
    );
}