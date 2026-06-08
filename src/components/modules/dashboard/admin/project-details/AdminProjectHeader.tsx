"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { DeleteProjectDialog } from "./DeleteProjectDialog";

interface AdminProjectHeaderProps {
    project: any;
    onRefresh: () => void;
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function AdminProjectHeader({ project, onRefresh }: AdminProjectHeaderProps) {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteSuccess = () => {
        router.push("/dashboard/projects");
        router.refresh();
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard/projects">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        <Badge className={statusColors[project.status]}>
                            {project.status}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>Created by: {project.createdBy?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {format(new Date(project.createdAt), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Last updated: {format(new Date(project.updatedAt), "MMM dd, yyyy")}</span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete Project
                </Button>
            </div>

            <DeleteProjectDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                project={project}
                onSuccess={handleDeleteSuccess}
            />
        </>
    );
}