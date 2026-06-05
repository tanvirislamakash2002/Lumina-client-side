"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    FolderKanban,
    CheckSquare,
    Users,
    MessageSquare,
    Clock,
    Calendar,
} from "lucide-react";

interface ProjectActivityTabProps {
    activities: any;
}

const actionIcons: Record<string, any> = {
    PROJECT_CREATED: FolderKanban,
    PROJECT_UPDATED: FolderKanban,
    PROJECT_DELETED: FolderKanban,
    TASK_CREATED: CheckSquare,
    TASK_UPDATED: CheckSquare,
    TASK_DELETED: CheckSquare,
    TASK_ASSIGNED: Users,
    TASK_STATUS_CHANGED: CheckSquare,
    MEMBER_ADDED: Users,
    MEMBER_REMOVED: Users,
    COMMENT_ADDED: MessageSquare,
    COMMENT_DELETED: MessageSquare,
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

export function ProjectActivityTab({ activities }: ProjectActivityTabProps) {
    const activityList = activities?.activities || [];

    if (activityList.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        No activity yet. Start by creating tasks or adding members.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activityList.map((activity: any) => {
                        const Icon = actionIcons[activity.action] || Clock;
                        return (
                            <div key={activity.id} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={activity.user?.image || undefined} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                        {getInitials(activity.user?.name || "U")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-sm">
                                            {activity.user?.name || "System"}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {activity.message}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-muted-foreground">
                                            {getRelativeTime(activity.createdAt)}
                                        </span>
                                        {activity.task && (
                                            <>
                                                <span className="text-xs text-muted-foreground">•</span>
                                                <span className="text-xs text-muted-foreground">
                                                    Task: {activity.task.title}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="p-1.5 rounded-full bg-muted">
                                    <Icon className="h-3 w-3 text-muted-foreground" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}