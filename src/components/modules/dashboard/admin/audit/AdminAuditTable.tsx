"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
    Eye,
    Shield,
    UserPlus,
    User,
    UserX,
    UserCheck,
    FolderX,
    Trash2,
    LogIn,
    AlertTriangle,
    Key,
    Settings,
    Download,
} from "lucide-react";

interface AdminAuditTableProps {
    auditLogs: any[];
    onRefresh: () => void;
}

const getActionBadge = (action: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
        ROLE_CHANGE: { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Shield, label: "Role Change" },
        USER_CREATED: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: UserPlus, label: "User Created" },
        USER_UPDATED: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: User, label: "User Updated" },
        USER_DELETED: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: UserX, label: "User Deleted" },
        USER_SUSPENDED: { color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: UserX, label: "User Suspended" },
        USER_ACTIVATED: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: UserCheck, label: "User Activated" },
        PROJECT_DELETED: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: FolderX, label: "Project Deleted" },
        TASK_DELETED: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: Trash2, label: "Task Deleted" },
        LOGIN_SUCCESS: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: LogIn, label: "Login Success" },
        LOGIN_FAILED: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: AlertTriangle, label: "Login Failed" },
        ADMIN_ACTION: { color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", icon: Shield, label: "Admin Action" },
    };
    return badges[action] || { color: "bg-gray-100 text-gray-700", icon: Settings, label: action };
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function AdminAuditTable({ auditLogs, onRefresh }: AdminAuditTableProps) {
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    if (auditLogs.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <Shield className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No audit events found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your filters to find audit events.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr className="text-left text-sm font-medium">
                                    <th className="p-4">Timestamp</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Action</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Target</th>
                                    <th className="p-4">IP Address</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.map((log) => {
                                    const actionBadge = getActionBadge(log.action);
                                    const ActionIcon = actionBadge.icon;
                                    const isSuccess = !log.message?.toLowerCase().includes("failed");

                                    return (
                                        <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="p-4 text-sm whitespace-nowrap">
                                                {format(new Date(log.createdAt), "MMM dd, HH:mm:ss")}
                                            </td>
                                            <td className="p-4">
                                                {log.user ? (
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={log.user.image} />
                                                            <AvatarFallback className="text-xs">
                                                                {getInitials(log.user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <Link
                                                            href={`/dashboard/admin/users/${log.user.id}`}
                                                            className="text-sm hover:text-indigo-600 transition-colors"
                                                        >
                                                            {log.user.name}
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">System</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <Badge className={`gap-1 ${actionBadge.color}`}>
                                                    <ActionIcon className="h-3 w-3" />
                                                    {actionBadge.label}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm line-clamp-1">{log.message}</span>
                                            </td>
                                            <td className="p-4">
                                                {log.project && (
                                                    <Link
                                                        href={`/dashboard/admin/projects/${log.project.id}`}
                                                        className="text-sm text-indigo-600 hover:underline"
                                                    >
                                                        {log.project.name}
                                                    </Link>
                                                )}
                                                {log.task && (
                                                    <Link
                                                        href={`/dashboard/admin/tasks/${log.task.id}`}
                                                        className="text-sm text-indigo-600 hover:underline"
                                                    >
                                                        {log.task.title}
                                                    </Link>
                                                )}
                                                {!log.project && !log.task && (
                                                    <span className="text-sm text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm font-mono">
                                                {log.ipAddress || "-"}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={isSuccess ? "default" : "destructive"}>
                                                    {isSuccess ? "Success" : "Failed"}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                        setSelectedLog(log);
                                                        setDetailsOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Details Modal */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Audit Event Details
                        </DialogTitle>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Timestamp</p>
                                    <p className="text-sm">{format(new Date(selectedLog.createdAt), "PPpp")}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">IP Address</p>
                                    <p className="text-sm font-mono">{selectedLog.ipAddress || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">User</p>
                                    <p className="text-sm">{selectedLog.user?.name || "System"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Action Type</p>
                                    <p>{getActionBadge(selectedLog.action).label}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">Message</p>
                                <p className="text-sm mt-1 p-3 rounded-md bg-muted">
                                    {selectedLog.message}
                                </p>
                            </div>

                            {selectedLog.details && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Metadata</p>
                                    <pre className="text-sm mt-1 p-3 rounded-md bg-muted overflow-x-auto">
                                        {JSON.stringify(selectedLog.details, null, 2)}
                                    </pre>
                                </div>
                            )}

                            <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground">Compliance Note</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    This audit log is immutable and cannot be modified or deleted.
                                    Retained for 7 years as required for compliance.
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}