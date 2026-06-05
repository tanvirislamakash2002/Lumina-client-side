"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Laptop, Smartphone, Globe, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { revokeSession, revokeAllSessions } from "@/actions/settings.action";

interface SessionsTabProps {
    initialData: any;
    currentUserId: string;
}

const getDeviceIcon = (userAgent: string) => {
    if (userAgent.toLowerCase().includes("mobile")) return Smartphone;
    if (userAgent.toLowerCase().includes("mac") || userAgent.toLowerCase().includes("windows")) return Laptop;
    return Globe;
};

export function SessionsTab({ initialData, currentUserId }: SessionsTabProps) {
    const [sessions, setSessions] = useState(initialData || []);
    const [isRevoking, setIsRevoking] = useState<string | null>(null);
    const [isRevokingAll, setIsRevokingAll] = useState(false);

    const handleRevokeSession = async (sessionId: string) => {
        setIsRevoking(sessionId);
        const toastId = toast.loading("Revoking session...");
        const result = await revokeSession(sessionId);

        if (result.success) {
            toast.success("Session revoked", { id: toastId });
            setSessions(sessions.filter((s: any) => s.id !== sessionId));
        } else {
            toast.error(result.message || "Failed to revoke session", { id: toastId });
        }
        setIsRevoking(null);
    };

    const handleRevokeAllSessions = async () => {
        setIsRevokingAll(true);
        const toastId = toast.loading("Revoking all other sessions...");
        const result = await revokeAllSessions();

        if (result.success) {
            toast.success("All other sessions revoked", { id: toastId });
            setSessions(sessions.filter((s: any) => s.isCurrent));
        } else {
            toast.error(result.message || "Failed to revoke sessions", { id: toastId });
        }
        setIsRevokingAll(false);
    };

    const otherSessions = sessions.filter((s: any) => !s.isCurrent);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>
                        Manage devices where you're logged in
                    </CardDescription>
                </div>
                {otherSessions.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                Revoke All Others
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Revoke All Other Sessions</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will log you out of all other devices. Your current session will remain active.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRevokeAllSessions} className="bg-red-600 hover:bg-red-700">
                                    {isRevokingAll ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Revoking...
                                        </>
                                    ) : (
                                        "Yes, Revoke All"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {sessions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        No active sessions found.
                    </p>
                ) : (
                    sessions.map((session: any) => {
                        const DeviceIcon = getDeviceIcon(session.userAgent);
                        return (
                            <div
                                key={session.id}
                                className="flex items-center justify-between p-4 rounded-lg border"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-muted">
                                        <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{session.userAgent}</p>
                                            {session.isCurrent && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Current
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                            <span>IP: {session.ipAddress}</span>
                                            <span>•</span>
                                            <span>Logged in: {new Date(session.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>Expires: {new Date(session.expiresAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                {!session.isCurrent && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Revoke Session</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will log out this device. Are you sure?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleRevokeSession(session.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    {isRevoking === session.id ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Revoking...
                                                        </>
                                                    ) : (
                                                        "Revoke"
                                                    )}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}