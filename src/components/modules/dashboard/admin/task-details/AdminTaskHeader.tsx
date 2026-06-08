"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { DeleteTaskDialog } from "./DeleteTaskDialog";

interface AdminTaskHeaderProps {
    task: any;
    onRefresh: () => void;
}

const statusColors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const priorityColors: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function AdminTaskHeader({ task, onRefresh }: AdminTaskHeaderProps) {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteSuccess = () => {
        router.push("/dashboard/tasks");
        router.refresh();
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard/tasks">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">{task.title}</h1>
                        <Badge className={statusColors[task.status]}>
                            {task.status.replace("_", " ")}
                        </Badge>
                        <Badge className={priorityColors[task.priority]}>
                            {task.priority}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>Created by: {task.createdBy?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {format(new Date(task.createdAt), "MMM dd, yyyy")}</span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete Task
                </Button>
            </div>

            <DeleteTaskDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                task={task}
                onSuccess={handleDeleteSuccess}
            />
        </>
    );
}