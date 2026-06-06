"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Calendar } from "lucide-react";

interface MemberProjectSummariesProps {
    projects: any[];
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

export function MemberProjectSummaries({ projects }: MemberProjectSummariesProps) {
    const activeProjects = projects.filter(p => p.status !== "COMPLETED").slice(0, 5);

    if (activeProjects.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-6">
                        You're not part of any active projects yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getDaysUntilDeadline = (deadline: string) => {
        const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (days < 0) return "Overdue";
        if (days === 0) return "Today";
        if (days === 1) return "Tomorrow";
        return `${days} days left`;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Projects</CardTitle>
                <Link href="/projects" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View all
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-4">
                {activeProjects.map((project) => {
                    const progress = project.stats?.progress || 0;
                    return (
                        <Link key={project.id} href={`/projects/${project.id}`} className="block group">
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
                                        <span>{getDaysUntilDeadline(project.deadline)}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{project.stats?.completedTasks || 0} completed</span>
                                        <span>{project.stats?.totalTasks || 0} total tasks</span>
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