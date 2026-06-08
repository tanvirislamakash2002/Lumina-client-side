"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Laptop, Globe, LogOut, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { revokeSession, revokeAllSessions } from "@/actions/settings.action";

interface AdminUserSessionsTabProps {
    sessions: any[];
    onRefresh: () => void;
}

const getDeviceIcon = (userAgent: string) => {
    if (userAgent.toLowerCase().includes("mobile")) return Smartphone;
    if (userAgent.toLowerCase().includes("windows") || userAgent.toLowerCase().includes("mac")) return Laptop;
    return Globe;
};

export function AdminUserSessionsTab({ sessions, onRefresh }: AdminUserSessionsTabProps) {
    const [isRevoking, setIsRevoking] = useState(false);

    const handleRevokeSession = async (sessionId: string) => {
        if (!confirm("Are you sure you want to revoke this session?")) return;

        setIsRevoking(true);
        try {
            const result = await revokeSession(sessionId);
            if (result.success) {
                toast.success("Session revoked successfully");
                onRefresh();
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
        if (!confirm("Are you sure you want to revoke all sessions except current?")) return;

        setIsRevoking(true);
        try {
            const result = await revokeAllSessions();
            if (result.success) {
                toast.success("All other sessions revoked successfully");
                onRefresh();
            } else {
                toast.error(result.message || "Failed to revoke sessions");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsRevoking(false);
        }
    };

    const otherSessions = sessions.filter(s => !s.isCurrent);

    if (sessions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No active sessions found.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Sessions</CardTitle>
                {otherSessions.length > 0 && (
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
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {sessions.map((session) => {
                        const DeviceIcon = getDeviceIcon(session.userAgent);
                        return (
                            <div
                                key={session.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-3"
                            >
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
                                            <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                                            <p className="text-xs text-muted-foreground">
                                                Expires: {format(new Date(session.expiresAt), "MMM dd, h:mm a")}
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
                    })}
                </div>
            </CardContent>
        </Card>
    );
}