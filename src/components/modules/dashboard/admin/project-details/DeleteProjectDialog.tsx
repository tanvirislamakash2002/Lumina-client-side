"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteProject } from "@/actions/admin.action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: any;
    onSuccess: () => void;
}

export function DeleteProjectDialog({
    open,
    onOpenChange,
    project,
    onSuccess,
}: DeleteProjectDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!project) return;

        setIsLoading(true);
        try {
            const result = await deleteProject(project.id);
            if (result.success) {
                toast.success(`Project "${project.name}" deleted successfully`);
                onOpenChange(false);
                onSuccess();
            } else {
                toast.error(result.message || "Failed to delete project");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{project?.name}"? This action cannot be undone.
                        All tasks, comments, and attachments will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Delete Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}