"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, FolderKanban, CheckSquare, Users, MessageSquare, Clock, Paperclip } from "lucide-react";
import { format } from "date-fns";

interface ProfileActivitiesTabProps {
    activities: any[];
}

const actionIcons: Record<string, any> = {
    PROJECT_CREATED: FolderKanban,
    PROJECT_UPDATED: FolderKanban,
    TASK_CREATED: CheckSquare,
    TASK_UPDATED: CheckSquare,
    TASK_DELETED: CheckSquare,
    TASK_ASSIGNED: Users,
    TASK_STATUS_CHANGED: CheckSquare,
    MEMBER_ADDED: Users,
    MEMBER_REMOVED: Users,
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

export function ProfileActivitiesTab({ activities }: ProfileActivitiesTabProps) {
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("all");

    const filteredActivities = activities.filter((activity) => {
        const matchesSearch = activity.message.toLowerCase().includes(search.toLowerCase());
        const matchesAction = actionFilter === "all" || activity.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    const actionTypes = [...new Set(activities.map((a) => a.action))];

    if (activities.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No recent activity to display.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search activities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter by action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Actions</SelectItem>
                            {actionTypes.map((action) => (
                                <SelectItem key={action} value={action}>
                                    {action.replace(/_/g, " ")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Activities List */}
                <div className="space-y-4">
                    {filteredActivities.map((activity) => {
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
                                                <Link
                                                    href={`/dashboard/projects/${activity.project.id}`}
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
                                                    href={`/dashboard/tasks/${activity.task.id}`}
                                                    className="text-xs text-indigo-600 hover:underline"
                                                >
                                                    {activity.task.title}
                                                </Link>
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

                {filteredActivities.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                        No activities match your filters.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}