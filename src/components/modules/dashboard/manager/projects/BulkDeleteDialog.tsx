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
import { bulkDeleteProjects } from "@/actions/project.action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BulkDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectIds: string[];
    onSuccess: () => void;
}

export function BulkDeleteDialog({
    open,
    onOpenChange,
    projectIds,
    onSuccess,
}: BulkDeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleBulkDelete = async () => {
        setIsLoading(true);
        try {
            const result = await bulkDeleteProjects(projectIds);
            if (result.success) {
                toast.success(result.message || `${projectIds.length} project(s) deleted successfully`);
                onOpenChange(false);
                onSuccess();
            } else {
                toast.error(result.message || "Failed to delete projects");
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
                    <DialogTitle>Delete Multiple Projects</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {projectIds.length} project(s)? This action cannot be undone.
                        All tasks, comments, and attachments in these projects will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleBulkDelete} disabled={isLoading}>
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Delete {projectIds.length} Project(s)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}