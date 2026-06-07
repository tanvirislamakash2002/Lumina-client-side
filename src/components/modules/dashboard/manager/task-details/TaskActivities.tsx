"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Activity, FolderKanban, CheckSquare, Users, MessageSquare, Clock, Paperclip } from "lucide-react";

interface TaskActivitiesProps {
    taskId: string;
    initialActivities: any[];
}

const actionIcons: Record<string, any> = {
    TASK_CREATED: CheckSquare,
    TASK_UPDATED: CheckSquare,
    TASK_DELETED: CheckSquare,
    TASK_ASSIGNED: Users,
    TASK_STATUS_CHANGED: CheckSquare,
    COMMENT_ADDED: MessageSquare,
    COMMENT_DELETED: MessageSquare,
    ATTACHMENT_ADDED: Paperclip,
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
    return format(then, "MMM dd, yyyy");
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function TaskActivities({ taskId, initialActivities }: TaskActivitiesProps) {
    if (initialActivities.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Activity Log
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No activities recorded for this task yet.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity Log
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {initialActivities.map((activity) => {
                        const Icon = actionIcons[activity.action] || Clock;
                        return (
                            <div key={activity.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={activity.user?.image || undefined} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                        {getInitials(activity.user?.name || "S")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-medium">
                                            {activity.user?.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {getRelativeTime(activity.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1">{activity.message}</p>
                                </div>
                                <div className="p-1.5 rounded-full bg-muted self-start">
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