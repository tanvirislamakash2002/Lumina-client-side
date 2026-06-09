"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    FolderKanban,
    CheckSquare,
    Users,
    MessageSquare,
    UserPlus,
    Clock,
} from "lucide-react";

interface AdminDashboardRecentActivitiesProps {
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
    TASK_STATUS_CHANGED: CheckSquare,
    MEMBER_ADDED: Users,
    MEMBER_REMOVED: Users,
    COMMENT_ADDED: MessageSquare,
    COMMENT_DELETED: MessageSquare,
    USER_REGISTER: UserPlus,
    ADMIN_ACTION: Clock,
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

export function AdminDashboardRecentActivities({ activities }: AdminDashboardRecentActivitiesProps) {
    if (activities.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        No recent activities to display.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activities</CardTitle>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/dashboard/audit">View all</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => {
                        const Icon = actionIcons[activity.action] || Clock;
                        return (
                            <div key={activity.id} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={activity.user?.image || undefined} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                        {getInitials(activity.user?.name || "S")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">{activity.message}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-muted-foreground">
                                            {getRelativeTime(activity.createdAt)}
                                        </span>
                                        {activity.project && (
                                            <>
                                                <span className="text-xs text-muted-foreground">•</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {activity.project.name}
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