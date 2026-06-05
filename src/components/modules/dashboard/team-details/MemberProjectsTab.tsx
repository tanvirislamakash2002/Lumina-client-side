"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Calendar } from "lucide-react";

interface MemberProjectsTabProps {
    projects: any[];
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function MemberProjectsTab({ projects }: MemberProjectsTabProps) {
    const [search, setSearch] = useState("");

    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
    );

    if (projects.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        This user is not a member of any projects yet.
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
            <CardHeader>
                <CardTitle>Projects ({projects.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Project List */}
                <div className="space-y-4">
                    {filteredProjects.map((project) => {
                        const progress = project.stats?.progress || 0;
                        return (
                            <Link href={`/projects/${project.id}`} key={project.id} className="block">
                                <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors space-y-3">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <h4 className="font-medium hover:text-indigo-600 transition-colors">
                                            {project.name}
                                        </h4>
                                        <Badge className={statusColors[project.status]}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                    {project.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{getDaysUntilDeadline(project.deadline)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">{progress}%</span>
                                            <Progress value={progress} className="h-2 w-24" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {filteredProjects.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                        No projects match your search.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}