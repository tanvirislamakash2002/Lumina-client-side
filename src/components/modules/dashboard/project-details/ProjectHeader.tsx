"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { deleteProject } from "@/actions/project.action";

interface ProjectHeaderProps {
    project: any;
    daysUntilDeadline: number;
    isOverdue: boolean;
    progress: number;
    canEdit: boolean;
    projectId: string;
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

export function ProjectHeader({
    project,
    daysUntilDeadline,
    isOverdue,
    progress,
    canEdit,
    projectId,
}: ProjectHeaderProps) {
    const router = useRouter();

    const handleDelete = async () => {
        const toastId = toast.loading("Deleting project...");
        const result = await deleteProject(projectId);
        if (result.success) {
            toast.success(result.message, { id: toastId });
            router.push("/projects");
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete project", { id: toastId });
        }
    };

    const getDeadlineText = () => {
        if (isOverdue) return "Overdue";
        if (daysUntilDeadline === 0) return "Due today";
        if (daysUntilDeadline === 1) return "Due tomorrow";
        return `${daysUntilDeadline} days left`;
    };

    return (
        <div className="space-y-4">
            {/* Title and Actions */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <Badge className={statusColors[project.status]}>
                            {statusLabels[project.status]}
                        </Badge>
                    </div>
                    {project.description && (
                        <p className="text-muted-foreground">{project.description}</p>
                    )}
                </div>

                {canEdit && (
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/projects/${projectId}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/tasks/create?projectId=${projectId}`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Task
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{project.name}"? This action cannot be undone.
                                        All tasks, members, and comments will be permanently deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>

            {/* Progress and Deadline */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-medium">
                            {new Date(project.deadline).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"}>
                            {getDeadlineText()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}