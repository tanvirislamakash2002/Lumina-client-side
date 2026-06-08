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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteTask } from "@/actions/task.action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: any;
    onSuccess: () => void;
}

export function DeleteTaskDialog({
    open,
    onOpenChange,
    task,
    onSuccess,
}: DeleteTaskDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState("");

    const handleDelete = async () => {
        if (!task) return;
        if (confirmTitle !== task.title) {
            toast.error("Task title confirmation does not match");
            return;
        }

        setIsLoading(true);
        try {
            const result = await deleteTask(task.id, task.projectId);
            if (result.success) {
                toast.success(`Task "${task.title}" deleted successfully`);
                onOpenChange(false);
                onSuccess();
            } else {
                toast.error(result.message || "Failed to delete task");
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
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{task?.title}"? This action cannot be undone.
                        All comments and attachments will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirmTitle">
                            Type <span className="font-bold">{task?.title}</span> to confirm
                        </Label>
                        <Input
                            id="confirmTitle"
                            placeholder="Enter task title"
                            value={confirmTitle}
                            onChange={(e) => setConfirmTitle(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading || confirmTitle !== task?.title}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}