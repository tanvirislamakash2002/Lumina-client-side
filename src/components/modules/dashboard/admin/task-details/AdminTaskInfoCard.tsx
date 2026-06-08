"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FolderKanban, User, Calendar, Clock, Flag } from "lucide-react";
import { format } from "date-fns";

interface AdminTaskInfoCardProps {
    task: any;
}

const priorityColors: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const getDaysUntil = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: "Overdue", color: "text-red-600" };
    if (days === 0) return { text: "Today", color: "text-amber-600" };
    if (days === 1) return { text: "Tomorrow", color: "text-amber-600" };
    return { text: `${days} days left`, color: "text-muted-foreground" };
};

export function AdminTaskInfoCard({ task }: AdminTaskInfoCardProps) {
    const deadlineInfo = getDaysUntil(task.dueDate);
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Description */}
                {task.description ? (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Description</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {task.description}
                        </p>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground italic">
                        No description provided.
                    </div>
                )}

                {/* Project */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Project:</span>
                    </div>
                    <Link
                        href={`/dashboard/projects/${task.project?.id}`}
                        className="text-sm font-medium hover:text-indigo-600 transition-colors"
                    >
                        {task.project?.name}
                    </Link>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-sm">Status:</span>
                    </div>
                    <span className="text-sm capitalize">{task.status.replace("_", " ")}</span>
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Priority:</span>
                    </div>
                    <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                    </Badge>
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Due Date:</span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm">{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                        <span className={`text-sm ml-2 ${isOverdue ? "text-red-600 font-medium" : deadlineInfo.color}`}>
                            ({deadlineInfo.text})
                        </span>
                    </div>
                </div>

                {/* Assigned To */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Assigned to:</span>
                    </div>
                    {task.assignedTo ? (
                        <Link
                            href={`/dashboard/users/${task.assignedTo.id}`}
                            className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                        >
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assignedTo.image || undefined} />
                                <AvatarFallback className="text-xs">
                                    {getInitials(task.assignedTo.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignedTo.name}</span>
                        </Link>
                    ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                </div>

                {/* Created At */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Created:</span>
                    </div>
                    <span className="text-sm">
                        {format(new Date(task.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                    </span>
                </div>

                {/* Updated At */}
                {task.updatedAt !== task.createdAt && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Last updated:</span>
                        </div>
                        <span className="text-sm">
                            {format(new Date(task.updatedAt), "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}