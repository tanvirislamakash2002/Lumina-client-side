"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Copy, FolderKanban, CheckSquare, Users, MessageSquare, UserPlus, UserMinus, Flag, Shield, Calendar, Clock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AuditTableProps {
    activities: any[];
}

const actionIcons: Record<string, any> = {
    PROJECT_CREATED: FolderKanban,
    PROJECT_UPDATED: FolderKanban,
    PROJECT_DELETED: FolderKanban,
    TASK_CREATED: CheckSquare,
    TASK_UPDATED: CheckSquare,
    TASK_DELETED: CheckSquare,
    TASK_ASSIGNED: Users,
    TASK_STATUS_CHANGED: Flag,
    MEMBER_ADDED: UserPlus,
    MEMBER_REMOVED: UserMinus,
    COMMENT_ADDED: MessageSquare,
    COMMENT_DELETED: MessageSquare,
    USER_REGISTER: UserPlus,
    ADMIN_ACTION: Shield,
};

const actionColors: Record<string, string> = {
    PROJECT_CREATED: "bg-green-100 text-green-700 dark:bg-green-900/30",
    PROJECT_UPDATED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
    PROJECT_DELETED: "bg-red-100 text-red-700 dark:bg-red-900/30",
    TASK_CREATED: "bg-green-100 text-green-700 dark:bg-green-900/30",
    TASK_UPDATED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
    TASK_DELETED: "bg-red-100 text-red-700 dark:bg-red-900/30",
    TASK_ASSIGNED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30",
    TASK_STATUS_CHANGED: "bg-orange-100 text-orange-700 dark:bg-orange-900/30",
    MEMBER_ADDED: "bg-green-100 text-green-700 dark:bg-green-900/30",
    MEMBER_REMOVED: "bg-red-100 text-red-700 dark:bg-red-900/30",
    COMMENT_ADDED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
    COMMENT_DELETED: "bg-red-100 text-red-700 dark:bg-red-900/30",
    USER_REGISTER: "bg-green-100 text-green-700 dark:bg-green-900/30",
    ADMIN_ACTION: "bg-purple-100 text-purple-700 dark:bg-purple-900/30",
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

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function AuditTable({ activities }: AuditTableProps) {
    const [selectedActivity, setSelectedActivity] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleViewDetails = (activity: any) => {
        setSelectedActivity(activity);
        setIsDialogOpen(true);
    };

    const handleCopyActivity = (activity: any) => {
        const activityText = `[${activity.createdAt}] ${activity.action}: ${activity.message}\nUser: ${activity.user?.name || "System"} (${activity.user?.email || "N/A"})\n${activity.project ? `Project: ${activity.project.name}\n` : ""}${activity.task ? `Task: ${activity.task.title}` : ""}`;
        navigator.clipboard.writeText(activityText);
        toast.success("Activity copied to clipboard");
    };

    if (activities.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Activity className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No audit records found</h3>
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
                            <div className="w-32">User</div>
                            <div className="w-32">Action</div>
                            <div className="flex-1">Message</div>
                            <div className="w-32">Resource</div>
                            <div className="w-24">Actions</div>
                        </div>

                        {activities.map((activity) => {
                            const Icon = actionIcons[activity.action] || Clock;
                            const actionColor = actionColors[activity.action] || "bg-gray-100 text-gray-700";
                            
                            return (
                                <div
                                    key={activity.id}
                                    className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                                >
                                    {/* Timestamp */}
                                    <div className="md:w-36 text-sm text-muted-foreground">
                                        <div>{new Date(activity.createdAt).toLocaleString()}</div>
                                        <div className="text-xs">{getRelativeTime(activity.createdAt)}</div>
                                    </div>

                                    {/* User */}
                                    <div className="md:w-32">
                                        {activity.user ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={activity.user.image || undefined} />
                                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                                        {getInitials(activity.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium truncate">{activity.user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{activity.user.email}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">System</span>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <div className="md:w-32">
                                        <Badge className={`${actionColor} flex items-center gap-1 w-fit`}>
                                            <Icon className="h-3 w-3" />
                                            {activity.action.replace(/_/g, " ")}
                                        </Badge>
                                    </div>

                                    {/* Message */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm truncate">{activity.message}</p>
                                    </div>

                                    {/* Resource */}
                                    <div className="md:w-32">
                                        {activity.project && (
                                            <Link href={`/projects/${activity.project.id}`} className="text-sm text-indigo-600 hover:underline">
                                                {activity.project.name}
                                            </Link>
                                        )}
                                        {activity.task && (
                                            <Link href={`/tasks/${activity.task.id}`} className="text-sm text-indigo-600 hover:underline">
                                                {activity.task.title}
                                            </Link>
                                        )}
                                        {!activity.project && !activity.task && (
                                            <span className="text-sm text-muted-foreground">-</span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="md:w-24 flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleViewDetails(activity)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleCopyActivity(activity)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Activity Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Activity Details</DialogTitle>
                    </DialogHeader>
                    {selectedActivity && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                                        <p className="text-sm">{new Date(selectedActivity.createdAt).toLocaleString()}</p>
                                    </div>
                                    <Badge className={actionColors[selectedActivity.action]}>
                                        {selectedActivity.action.replace(/_/g, " ")}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">User</p>
                                    {selectedActivity.user ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={selectedActivity.user.image || undefined} />
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                                    {getInitials(selectedActivity.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm">{selectedActivity.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{selectedActivity.user.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm">System</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Message</p>
                                    <p className="text-sm">{selectedActivity.message}</p>
                                </div>

                                {selectedActivity.project && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Project</p>
                                        <Link href={`/projects/${selectedActivity.project.id}`} className="text-sm text-indigo-600 hover:underline">
                                            {selectedActivity.project.name}
                                        </Link>
                                    </div>
                                )}

                                {selectedActivity.task && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Task</p>
                                        <Link href={`/tasks/${selectedActivity.task.id}`} className="text-sm text-indigo-600 hover:underline">
                                            {selectedActivity.task.title}
                                        </Link>
                                    </div>
                                )}

                                {selectedActivity.details && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Additional Details</p>
                                        <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-48">
                                            {JSON.stringify(selectedActivity.details, null, 2)}
                                        </pre>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Activity ID</p>
                                    <p className="text-xs font-mono text-muted-foreground">{selectedActivity.id}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

// Import missing icon
import { Activity } from "lucide-react";