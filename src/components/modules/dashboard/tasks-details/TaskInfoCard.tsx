"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, FolderKanban, Clock } from "lucide-react";

interface TaskInfoCardProps {
    task: any;
}

const getRelativeDueDate = (dueDate: string, status: string) => {
    if (status === "COMPLETED") return { text: "Completed", color: "text-muted-foreground" };

    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: "Overdue", color: "text-red-500" };
    if (days === 0) return { text: "Today", color: "text-amber-500" };
    if (days === 1) return { text: "Tomorrow", color: "text-amber-500" };
    return { text: `${days} days left`, color: "text-muted-foreground" };
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function TaskInfoCard({ task }: TaskInfoCardProps) {
    const dueDateInfo = getRelativeDueDate(task.dueDate, task.status);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Description */}
                {task.description && (
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                        <p className="text-sm whitespace-pre-wrap">{task.description}</p>
                    </div>
                )}

                {/* Info Grid */}
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    {/* Assignee */}
                    <div className="flex items-start gap-3">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm text-muted-foreground">Assignee</p>
                            {task.assignedTo ? (
                                <Link href={`/team/${task.assignedTo.id}`} className="flex items-center gap-2 mt-1">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={task.assignedTo.image || undefined} />
                                        <AvatarFallback className="text-[10px]">
                                            {getInitials(task.assignedTo.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium hover:text-indigo-600">
                                        {task.assignedTo.name}
                                    </span>
                                </Link>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-1">Unassigned</p>
                            )}
                        </div>
                    </div>

                    {/* Project */}
                    <div className="flex items-start gap-3">
                        <FolderKanban className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm text-muted-foreground">Project</p>
                            <Link href={`/projects/${task.project.id}`} className="text-sm font-medium hover:text-indigo-600 mt-1 block">
                                {task.project.name}
                            </Link>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm text-muted-foreground">Due Date</p>
                            <p className="text-sm font-medium mt-1">
                                {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                            <p className={`text-xs ${dueDateInfo.color}`}>
                                {dueDateInfo.text}
                            </p>
                        </div>
                    </div>

                    {/* Created At */}
                    <div className="flex items-start gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="text-sm font-medium mt-1">
                                {new Date(task.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}