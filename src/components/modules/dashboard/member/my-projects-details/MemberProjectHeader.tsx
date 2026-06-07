"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, CheckCircle, PauseCircle, PlayCircle } from "lucide-react";
import { format } from "date-fns";

interface MemberProjectHeaderProps {
    project: any;
    onRefresh: () => void;
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const statusIcons: Record<string, any> = {
    ACTIVE: PlayCircle,
    COMPLETED: CheckCircle,
    ON_HOLD: PauseCircle,
};

const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: "Overdue", color: "text-red-600" };
    if (days === 0) return { text: "Due today", color: "text-amber-600" };
    if (days === 1) return { text: "Due tomorrow", color: "text-amber-600" };
    return { text: `${days} days left`, color: "text-muted-foreground" };
};

export function MemberProjectHeader({ project, onRefresh }: MemberProjectHeaderProps) {
    const StatusIcon = statusIcons[project.status] || PlayCircle;
    const deadlineInfo = getDaysUntilDeadline(project.deadline);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/my-projects">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <Badge className={statusColors[project.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {project.status.replace("_", " ")}
                    </Badge>
                </div>

                {project.description && (
                    <p className="text-muted-foreground max-w-2xl">
                        {project.description}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {format(new Date(project.createdAt), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className={deadlineInfo.color}>{deadlineInfo.text}</span>
                        <span>(Deadline: {format(new Date(project.deadline), "MMM dd, yyyy")})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Last updated: {format(new Date(project.updatedAt), "MMM dd, yyyy")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}