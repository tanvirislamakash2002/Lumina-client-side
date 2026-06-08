"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Trash2, Calendar, Users, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { deleteProject } from "@/actions/admin.action";

interface AdminProjectsTableProps {
    projects: any[];
    onRefresh: () => void;
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: "Overdue", color: "text-red-600" };
    if (days === 0) return { text: "Today", color: "text-amber-600" };
    if (days === 1) return { text: "Tomorrow", color: "text-amber-600" };
    return { text: `${days} days left`, color: "text-muted-foreground" };
};

export function AdminProjectsTable({ projects, onRefresh }: AdminProjectsTableProps) {
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProjects(projects.map((p) => p.id));
        } else {
            setSelectedProjects([]);
        }
    };

    const handleSelectProject = (projectId: string, checked: boolean) => {
        if (checked) {
            setSelectedProjects([...selectedProjects, projectId]);
        } else {
            setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
        }
    };

    const handleDelete = async () => {
        if (!projectToDelete) return;

        setIsLoading(true);
        try {
            const result = await deleteProject(projectToDelete.id);
            if (result.success) {
                toast.success(`Project "${projectToDelete.name}" deleted successfully`);
                setDeleteDialogOpen(false);
                setProjectToDelete(null);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to delete project");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (projects.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <FolderIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No projects found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your filters to find projects.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr className="text-left text-sm font-medium">
                                    <th className="w-12 p-4">
                                        <Checkbox
                                            checked={projects.length > 0 && selectedProjects.length === projects.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-4">Project Name</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Deadline</th>
                                    <th className="p-4">Progress</th>
                                    <th className="p-4">Tasks</th>
                                    <th className="p-4">Members</th>
                                    <th className="p-4">Created</th>
                                    <th className="p-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => {
                                    const progress = project.stats?.progress || 0;
                                    const totalTasks = project.stats?.totalTasks || 0;
                                    const completedTasks = project.stats?.completedTasks || 0;
                                    const memberCount = project.stats?.memberCount || 0;
                                    const deadlineInfo = getDaysUntilDeadline(project.deadline);
                                    const isSelected = selectedProjects.includes(project.id);
                                    const isOverdue = deadlineInfo.text === "Overdue" && project.status !== "COMPLETED";

                                    return (
                                        <tr key={project.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="p-4">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleSelectProject(project.id, checked as boolean)}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <Link
                                                    href={`/dashboard/admin/projects/${project.id}`}
                                                    className="font-medium hover:text-indigo-600 transition-colors"
                                                >
                                                    {project.name}
                                                </Link>
                                                {project.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                        {project.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <Badge className={statusColors[project.status]}>
                                                    {project.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" : deadlineInfo.color}`}>
                                                        {deadlineInfo.text}
                                                    </span>
                                                    {isOverdue && (
                                                        <AlertCircle className="h-3 w-3 text-red-500" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 min-w-[120px]">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">{progress}%</span>
                                                    </div>
                                                    <Progress value={progress} className="h-2" />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">
                                                    {completedTasks}/{totalTasks}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{memberCount}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">
                                                {format(new Date(project.createdAt), "MMM dd, yyyy")}
                                            </td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/admin/projects/${project.id}`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setProjectToDelete(project);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete Project
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                             </td>
                                         </tr>
                                    );
                                })}
                            </tbody>
                         </table>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
                            All tasks, comments, and attachments will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function FolderIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
        </svg>
    );
}