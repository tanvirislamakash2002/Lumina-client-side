"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    ArrowRight, 
    FolderKanban, 
    CheckSquare, 
    Users, 
    MessageSquare,
    Clock 
} from "lucide-react";

interface RecentActivitiesProps {
    data: Array<{
        id: string;
        action: string;
        message: string;
        createdAt: string;
        user: { id: string; name: string; image: string | null };
        project: { id: string; name: string } | null;
        task: { id: string; title: string } | null;
    }> | null;
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

export function RecentActivities({ data }: RecentActivitiesProps) {
    const activities = data || [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activities</CardTitle>
                <Link 
                    href="/activities" 
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                    View all
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent>
                {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                        No recent activities to display.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => {
                            const Icon = actionIcons[activity.action] || Clock;
                            return (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-muted">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">{activity.message}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">
                                                {getRelativeTime(activity.createdAt)}
                                            </span>
                                            {activity.project && (
                                                <>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <Link 
                                                        href={`/projects/${activity.project.id}`}
                                                        className="text-xs text-indigo-600 hover:underline"
                                                    >
                                                        {activity.project.name}
                                                    </Link>
                                                </>
                                            )}
                                            {activity.task && (
                                                <>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <Link 
                                                        href={`/tasks/${activity.task.id}`}
                                                        className="text-xs text-indigo-600 hover:underline"
                                                    >
                                                        {activity.task.title}
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}