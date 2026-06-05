"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Calendar } from "lucide-react";

interface ProjectSummariesProps {
    data: Array<{
        id: string;
        name: string;
        status: string;
        deadline: string;
        daysUntilDeadline: number;
        totalTasks: number;
        completedTasks: number;
        progress: number;
        isOverdue: boolean;
    }> | null;
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const statusLabels: Record<string, string> = {
    ACTIVE: "Active",
    COMPLETED: "Completed",
    ON_HOLD: "On Hold",
};

export function ProjectSummaries({ data }: ProjectSummariesProps) {
    const projects = data || [];

    if (projects.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-6">
                        No projects yet. Create your first project to get started.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Projects</CardTitle>
                <Link 
                    href="/projects" 
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                    View all
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-4">
                {projects.map((project) => (
                    <Link 
                        key={project.id} 
                        href={`/projects/${project.id}`}
                        className="block group"
                    >
                        <div className="space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium group-hover:text-indigo-600 transition-colors">
                                        {project.name}
                                    </h4>
                                    <Badge className={statusColors[project.status]}>
                                        {statusLabels[project.status]}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span className={project.isOverdue ? "text-red-500" : ""}>
                                        {project.daysUntilDeadline < 0 
                                            ? "Overdue" 
                                            : project.daysUntilDeadline === 0 
                                                ? "Due today" 
                                                : `${project.daysUntilDeadline} days left`}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{project.completedTasks} completed</span>
                                    <span>{project.totalTasks} total tasks</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}