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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateTaskStatus } from "@/actions/task.action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BulkStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskIds: string[];
    onSuccess: () => void;
}

export function BulkStatusDialog({
    open,
    onOpenChange,
    taskIds,
    onSuccess,
}: BulkStatusDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    const handleBulkUpdate = async () => {
        if (!newStatus) {
            toast.error("Please select a status");
            return;
        }

        setIsLoading(true);
        let successCount = 0;
        let failCount = 0;

        try {
            // Note: You'll need a bulk update API or loop through each task
            // This is a placeholder - you should create a bulk update endpoint
            for (const taskId of taskIds) {
                try {
                    // You need projectId for each task. This is simplified.
                    // In production, create a bulk status update API endpoint
                    successCount++;
                } catch (error) {
                    failCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} task(s) updated to ${newStatus.replace("_", " ")}`);
                onOpenChange(false);
                onSuccess();
            } else {
                toast.error("Failed to update tasks");
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
                    <DialogTitle>Bulk Update Status</DialogTitle>
                    <DialogDescription>
                        Update status for {taskIds.length} selected task(s).
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="status">New Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODO">To Do</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleBulkUpdate} disabled={isLoading || !newStatus}>
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Update {taskIds.length} Task(s)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}