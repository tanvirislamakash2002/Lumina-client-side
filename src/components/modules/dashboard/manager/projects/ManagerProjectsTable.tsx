"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";

interface ManagerProjectsTableProps {
    projects: any[];
    selectedProjects: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectProject: (projectId: string, checked: boolean) => void;
    onEdit: (project: any) => void;
    onDelete: (project: any) => void;
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
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days left`;
};

const getDeadlineColor = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "text-red-600";
    if (days <= 3) return "text-amber-600";
    return "text-muted-foreground";
};

export function ManagerProjectsTable({
    projects,
    selectedProjects,
    onSelectAll,
    onSelectProject,
    onEdit,
    onDelete,
}: ManagerProjectsTableProps) {
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
                            {selectedProjects.length > 0 
                                ? "No projects match your filters."
                                : "Get started by creating your first project."}
                        </p>
                        {selectedProjects.length === 0 && (
                            <Button asChild className="mt-2">
                                <Link href="/projects/create">Create Project</Link>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-muted/50">
                            <tr className="text-left text-sm font-medium">
                                <th className="w-12 p-4">
                                    <Checkbox
                                        checked={
                                            projects.length > 0 && selectedProjects.length === projects.length
                                        }
                                        onCheckedChange={onSelectAll}
                                    />
                                </th>
                                <th className="p-4">Project Name</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Deadline</th>
                                <th className="p-4">Progress</th>
                                <th className="p-4">Tasks</th>
                                <th className="p-4">Members</th>
                                <th className="p-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => {
                                const progress = project.stats?.progress || 0;
                                const totalTasks = project.stats?.totalTasks || 0;
                                const completedTasks = project.stats?.completedTasks || 0;
                                const memberCount = project.stats?.memberCount || 0;
                                const isSelected = selectedProjects.includes(project.id);

                                return (
                                    <tr
                                        key={project.id}
                                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="p-4">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={(checked) =>
                                                    onSelectProject(project.id, checked as boolean)
                                                }
                                            />
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/dashboard/projects/${project.id}`}
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
                                                {statusLabels[project.status]}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-sm ${getDeadlineColor(project.deadline)}`}>
                                                {getDaysUntilDeadline(project.deadline)}
                                            </span>
                                        </td>
                                        <td className="p-4 min-w-[150px]">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <Progress value={progress} className="h-2" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">
                                                <span className="font-medium">{completedTasks}</span>
                                                <span className="text-muted-foreground">/{totalTasks}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                <UsersIcon className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm">{memberCount}</span>
                                            </div>
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
                                                        <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-2">
                                                            <ExternalLink className="h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onEdit(project)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(project)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
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
    );
}

// Helper icons
function FolderIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
        </svg>
    );
}

function UsersIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}