"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Trash2, Calendar } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteProject } from "@/actions/admin.action";

interface AdminProjectsTableProps {
    projects: any[];
    selectedProjects: string[];
    onSelectProject: (projectId: string) => void;
    onSelectAll: () => void;
    allSelected: boolean;
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

export function AdminProjectsTable({
    projects,
    selectedProjects,
    onSelectProject,
    onSelectAll,
    allSelected,
}: AdminProjectsTableProps) {
    const handleDeleteProject = async (projectId: string, projectName: string) => {
        const toastId = toast.loading(`Deleting "${projectName}"...`);
        const result = await deleteProject(projectId);
        if (result.success) {
            toast.success(result.message, { id: toastId });
        } else {
            toast.error(result.message || "Failed to delete project", { id: toastId });
        }
    };

    if (projects.length === 0) {
        return (
            <Card>
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

    return (
        <Card>
            <CardContent className="p-0">
                <div className="divide-y">
                    {/* Header Row */}
                    <div className="hidden md:flex items-center gap-4 p-4 bg-muted/30 text-sm font-medium">
                        <div className="w-8">
                            <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
                        </div>
                        <div className="flex-1">Project Name</div>
                        <div className="w-24">Status</div>
                        <div className="w-32">Deadline</div>
                        <div className="w-24">Tasks</div>
                        <div className="w-24">Members</div>
                        <div className="w-24">Progress</div>
                        <div className="w-20">Actions</div>
                    </div>

                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                        >
                            {/* Checkbox */}
                            <div className="w-8">
                                <Checkbox
                                    checked={selectedProjects.includes(project.id)}
                                    onCheckedChange={() => onSelectProject(project.id)}
                                />
                            </div>

                            {/* Project Info */}
                            <div className="flex-1 min-w-0">
                                <Link href={`/projects/${project.id}`}>
                                    <p className="font-medium hover:text-indigo-600 transition-colors truncate">
                                        {project.name}
                                    </p>
                                </Link>
                                {project.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {project.description}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="w-24">
                                <Badge className={statusColors[project.status]}>
                                    {project.status}
                                </Badge>
                            </div>

                            {/* Deadline */}
                            <div className="w-32 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{getDaysUntilDeadline(project.deadline)}</span>
                                </div>
                                <div className="text-xs">
                                    {new Date(project.deadline).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Tasks */}
                            <div className="w-24 text-sm text-muted-foreground">
                                {project.stats?.totalTasks || 0}
                            </div>

                            {/* Members */}
                            <div className="w-24 text-sm text-muted-foreground">
                                {project.stats?.memberCount || 0}
                            </div>

                            {/* Progress */}
                            <div className="w-24">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                        {project.stats?.progress || 0}%
                                    </span>
                                    <Progress value={project.stats?.progress || 0} className="h-2 w-16" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="w-20 flex items-center gap-1">
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                    <Link href={`/projects/${project.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete "{project.name}"?
                                                This will also delete all tasks, members, comments, and attachments associated with this project.
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteProject(project.id, project.name)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Import missing icon
import { FolderKanban } from "lucide-react";