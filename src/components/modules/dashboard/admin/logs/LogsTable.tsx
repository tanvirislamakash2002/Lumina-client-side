"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Copy, Terminal } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface LogsTableProps {
    logs: any[];
}

const levelColors: Record<string, string> = {
    INFO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    WARN: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    ERROR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const getRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return then.toLocaleDateString();
};

export function LogsTable({ logs }: LogsTableProps) {
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleViewDetails = (log: any) => {
        setSelectedLog(log);
        setIsDialogOpen(true);
    };

    const handleCopyLog = (log: any) => {
        const logText = `[${log.createdAt}] ${log.level} - ${log.action}: ${log.message}\nUser: ${log.userName || "System"} (${log.userEmail || "N/A"})\nID: ${log.id}`;
        navigator.clipboard.writeText(logText);
        toast.success("Log copied to clipboard");
    };

    if (logs.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Terminal className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No logs found</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        Try adjusting your filters or date range
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {/* Header Row */}
                        <div className="hidden md:flex items-center gap-4 p-4 bg-muted/30 text-sm font-medium">
                            <div className="w-36">Timestamp</div>
                            <div className="w-20">Level</div>
                            <div className="w-32">Action</div>
                            <div className="flex-1">Message</div>
                            <div className="w-32">User</div>
                            <div className="w-24">Actions</div>
                        </div>

                        {logs.map((log) => (
                            <div
                                key={log.id}
                                className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                            >
                                {/* Timestamp */}
                                <div className="md:w-36 text-sm text-muted-foreground">
                                    <div>{new Date(log.createdAt).toLocaleString()}</div>
                                    <div className="text-xs">{getRelativeTime(log.createdAt)}</div>
                                </div>

                                {/* Level */}
                                <div className="md:w-20">
                                    <Badge className={levelColors[log.level]}>
                                        {log.level}
                                    </Badge>
                                </div>

                                {/* Action */}
                                <div className="md:w-32">
                                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                        {log.action}
                                    </code>
                                </div>

                                {/* Message */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate">{log.message}</p>
                                </div>

                                {/* User */}
                                <div className="md:w-32">
                                    {log.userName ? (
                                        <div>
                                            <p className="text-sm font-medium truncate">{log.userName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{log.userEmail}</p>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">System</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="md:w-24 flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleViewDetails(log)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleCopyLog(log)}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Log Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Log Details</DialogTitle>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                                        <p className="text-sm">{new Date(selectedLog.createdAt).toLocaleString()}</p>
                                    </div>
                                    <Badge className={levelColors[selectedLog.level]}>
                                        {selectedLog.level}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Action</p>
                                    <code className="text-sm bg-muted px-2 py-1 rounded">
                                        {selectedLog.action}
                                    </code>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Message</p>
                                    <p className="text-sm whitespace-pre-wrap break-words">{selectedLog.message}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">User ID</p>
                                        <p className="text-sm font-mono">{selectedLog.userId || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">User Name</p>
                                        <p className="text-sm">{selectedLog.userName || "System"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">User Email</p>
                                    <p className="text-sm">{selectedLog.userEmail || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Log ID</p>
                                    <p className="text-xs font-mono text-muted-foreground">{selectedLog.id}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}