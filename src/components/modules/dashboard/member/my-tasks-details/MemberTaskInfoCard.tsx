"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FolderKanban, User, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface MemberTaskInfoCardProps {
    task: any;
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function MemberTaskInfoCard({ task }: MemberTaskInfoCardProps) {
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
                        href={`/dashboard/my-projects/${task.project?.id}`}
                        className="text-sm font-medium hover:text-indigo-600 transition-colors"
                    >
                        {task.project?.name}
                    </Link>
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