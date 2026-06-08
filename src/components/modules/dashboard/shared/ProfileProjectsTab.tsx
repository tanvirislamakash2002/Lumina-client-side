"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";

interface ProfileProjectsTabProps {
    projects: any[];
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days left`;
};

export function ProfileProjectsTab({ projects }: ProfileProjectsTabProps) {
    if (projects.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        You are not a member of any projects yet.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {projects.map((project) => {
                    const progress = project.stats?.progress || 0;
                    return (
                        <Link
                            key={project.id}
                            href={`/dashboard/projects/${project.id}`}
                            className="block"
                        >
                            <div className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                                    <div>
                                        <h3 className="font-semibold hover:text-indigo-600 transition-colors">
                                            {project.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <Badge className={statusColors[project.status]}>
                                                {project.status}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                Joined {format(new Date(project.joinedAt), "MMM dd, yyyy")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>{getDaysUntilDeadline(project.deadline)}</span>
                                    </div>
                                </div>

                                {project.description && (
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {project.description}
                                    </p>
                                )}

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                    <div className="flex flex-wrap justify-between text-xs text-muted-foreground gap-2">
                                        <span>{project.stats?.completedTasks || 0} completed</span>
                                        <span>{project.stats?.totalTasks || 0} total tasks</span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {project.stats?.memberCount || 0} members
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </CardContent>
        </Card>
    );
}