"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";

interface RecentProjectsTableProps {
    projects: any[];
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function RecentProjectsTable({ projects }: RecentProjectsTableProps) {
    if (projects.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        No projects created yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Projects</CardTitle>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/projects">View all</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{project.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className={statusColors[project.status]}>
                                        {project.status}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right mr-2">
                                    <p className="text-sm font-medium">{project.stats?.totalTasks || 0} tasks</p>
                                    <p className="text-xs text-muted-foreground">{project.stats?.memberCount || 0} members</p>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                    <Link href={`/projects/${project.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}