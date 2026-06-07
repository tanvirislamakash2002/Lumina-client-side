"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Eye, ListTodo } from "lucide-react";
import { format } from "date-fns";

interface MemberProjectsGridProps {
    projects: any[];
    currentUser: any;
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

const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: "Overdue", color: "text-red-600" };
    if (days === 0) return { text: "Due today", color: "text-amber-600" };
    if (days === 1) return { text: "Due tomorrow", color: "text-amber-600" };
    return { text: `${days} days left`, color: "text-muted-foreground" };
};

export function MemberProjectsGrid({ projects, currentUser }: MemberProjectsGridProps) {
    if (projects.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <FolderIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No projects found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            You're not a member of any projects yet.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            When you're added to a project, it will appear here.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
                const progress = project.stats?.progress || 0;
                const totalTasks = project.stats?.totalTasks || 0;
                const completedTasks = project.stats?.completedTasks || 0;
                const memberCount = project.stats?.memberCount || 0;
                const deadlineInfo = getDaysUntilDeadline(project.deadline);

                return (
                    <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">
                                        <Link
                                            href={`/dashboard/my-projects/${project.id}`}
                                            className="hover:text-indigo-600 transition-colors"
                                        >
                                            {project.name}
                                        </Link>
                                    </CardTitle>
                                    <Badge className={statusColors[project.status]}>
                                        {statusLabels[project.status]}
                                    </Badge>
                                </div>
                            </div>
                            {project.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                    {project.description}
                                </p>
                            )}
                        </CardHeader>

                        <CardContent className="flex-1 space-y-4">
                            {/* Progress */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{completedTasks} completed</span>
                                    <span>{totalTasks} total tasks</span>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Deadline</span>
                                    </div>
                                    <span className={deadlineInfo.color}>
                                        {deadlineInfo.text}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>Members</span>
                                    </div>
                                    <span>{memberCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Created</span>
                                    </div>
                                    <span>{format(new Date(project.createdAt), "MMM dd, yyyy")}</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex gap-2 pt-4">
                            <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                                <Link href={`/dashboard/my-projects/${project.id}`}>
                                    <Eye className="h-4 w-4" />
                                    View Details
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                                <Link href={`/dashboard/my-tasks?projectId=${project.id}`}>
                                    <ListTodo className="h-4 w-4" />
                                    View Tasks
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}

function FolderIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
        </svg>
    );
}