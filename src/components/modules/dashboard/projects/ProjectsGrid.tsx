"use client";

import Link from "next/link";
import { Calendar, Users, CheckCircle, Clock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectsGridProps {
    projects: any[];
    userRole: string;
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

export function ProjectsGrid({ projects, userRole }: ProjectsGridProps) {
    if (projects.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <FolderKanban className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No projects found</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        Try adjusting your search or filters
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <Link href={`/projects/${project.id}`}>
                                    <CardTitle className="text-lg hover:text-indigo-600 transition-colors cursor-pointer">
                                        {project.name}
                                    </CardTitle>
                                </Link>
                                {project.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {project.description}
                                    </p>
                                )}
                            </div>
                            <Badge className={statusColors[project.status]}>
                                {statusLabels[project.status]}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{getDaysUntilDeadline(project.deadline)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                <span>{project.stats?.memberCount || 0} members</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{project.stats?.progress || 0}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600 rounded-full transition-all"
                                    style={{ width: `${project.stats?.progress || 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>
                                    {project.stats?.completedTasks || 0}/{project.stats?.totalTasks || 0} tasks
                                </span>
                            </div>
                            {(userRole === "ADMIN" || userRole === "PROJECT_MANAGER") && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/projects/${project.id}/edit`}>Edit Project</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Import missing icon
import { FolderKanban } from "lucide-react";