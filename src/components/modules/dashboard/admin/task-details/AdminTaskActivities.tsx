"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Activity, CheckSquare, Users, MessageSquare, Clock, Paperclip, Filter } from "lucide-react";
import Link from "next/link";

interface AdminTaskActivitiesProps {
    activities: any[];
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

export function AdminTaskActivities({ activities }: AdminTaskActivitiesProps) {
    const [actionFilter, setActionFilter] = useState("all");

    const filteredActivities = activities.filter((activity) => {
        return actionFilter === "all" || activity.action === actionFilter;
    });

    const actionTypes = [...new Set(activities.map((a) => a.action))];

    if (activities.length === 0) {
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
                        No activities recorded for this task.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Activity Log
                    </CardTitle>
                    <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter className="h-4 w-4 mr-2" />
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
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filteredActivities.map((activity) => {
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
                                        <Link
                                            href={`/dashboard/users/${activity.user?.id}`}
                                            className="text-sm font-medium hover:text-indigo-600 transition-colors"
                                        >
                                            {activity.user?.name}
                                        </Link>
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

                {filteredActivities.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                        No activities match your filter.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}