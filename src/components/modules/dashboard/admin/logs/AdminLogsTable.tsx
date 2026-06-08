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
import { Eye, AlertCircle, AlertTriangle, Info, Bug, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface AdminLogsTableProps {
    logs: any[];
    onRefresh: () => void;
}

const getLevelBadge = (level: string) => {
    switch (level?.toUpperCase()) {
        case "ERROR":
            return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">ERROR</Badge>;
        case "WARNING":
            return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">WARNING</Badge>;
        case "INFO":
            return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">INFO</Badge>;
        default:
            return <Badge variant="secondary">DEBUG</Badge>;
    }
};

const getLevelIcon = (level: string) => {
    switch (level?.toUpperCase()) {
        case "ERROR":
            return <AlertCircle className="h-4 w-4 text-red-500" />;
        case "WARNING":
            return <AlertTriangle className="h-4 w-4 text-amber-500" />;
        case "INFO":
            return <Info className="h-4 w-4 text-blue-500" />;
        default:
            return <Bug className="h-4 w-4 text-gray-500" />;
    }
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function AdminLogsTable({ logs, onRefresh }: AdminLogsTableProps) {
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    if (logs.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <ScrollTextIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No logs found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your filters to find logs.
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
                                    <th className="p-4">Level</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Message</th>
                                    <th className="p-4">IP Address</th>
                                    <th className="p-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30">
                                        <td className="p-4 text-sm whitespace-nowrap">
                                            {format(new Date(log.createdAt), "MMM dd, HH:mm:ss")}
                                        </td>
                                        <td className="p-4">
                                            {getLevelBadge(log.action)}  {/* Use action as level */}
                                        </td>
                                        <td className="p-4">
                                            {log.user?.name ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={log.user?.image} />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(log.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <Link
                                                        href={`/dashboard/admin/users/${log.user?.id}`}
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
                                            <div className="flex items-center gap-2">
                                                {getLevelIcon(log.action)}
                                                <span className="text-sm line-clamp-1">{log.message}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-mono">
                                            {log.ipAddress || "-"}
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Log Details Modal */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedLog && getLevelIcon(selectedLog.level)}
                            Log Details
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
                                    <p className="text-xs text-muted-foreground">Level</p>
                                    <p>{getLevelBadge(selectedLog.level)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">User</p>
                                    <p className="text-sm">{selectedLog.userName || "System"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">IP Address</p>
                                    <p className="text-sm font-mono">{selectedLog.ipAddress || "-"}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Message</p>
                                <p className="text-sm mt-1 p-3 rounded-md bg-muted whitespace-pre-wrap">
                                    {selectedLog.message}
                                </p>
                            </div>
                            {selectedLog.action && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Action</p>
                                    <p className="text-sm mt-1">{selectedLog.action}</p>
                                </div>
                            )}
                            {selectedLog.details && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Details</p>
                                    <pre className="text-sm mt-1 p-3 rounded-md bg-muted overflow-x-auto whitespace-pre-wrap">
                                        {JSON.stringify(selectedLog.details, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function ScrollTextIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
            <path d="M8 6h8" />
            <path d="M8 10h6" />
            <path d="M8 14h4" />
            <path d="M16 18H8" />
        </svg>
    );
}