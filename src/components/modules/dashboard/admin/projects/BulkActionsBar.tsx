"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { bulkDeleteProjects } from "@/actions/project.action";

interface BulkActionsBarProps {
    selectedCount: number;
    selectedProjects: string[];
    onClearSelection: () => void;
}

export function BulkActionsBar({ selectedCount, selectedProjects, onClearSelection }: BulkActionsBarProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleBulkDelete = async () => {
        setIsLoading(true);
        const toastId = toast.loading(`Deleting ${selectedCount} project${selectedCount !== 1 ? "s" : ""}...`);
        
        // Use the imported bulkDeleteProjects action
        const result = await bulkDeleteProjects(selectedProjects);
        
        if (result.success) {
            toast.success(result.message, { id: toastId });
            onClearSelection();
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete projects", { id: toastId });
        }
        setIsLoading(false);
    };

    return (
        <Card className="p-3 bg-muted/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                        {selectedCount} project{selectedCount !== 1 ? "s" : ""} selected
                    </span>
                    <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8 px-2">
                        <X className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                </div>

                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete Selected
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bulk Delete Projects</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete {selectedCount} project{selectedCount !== 1 ? "s" : ""}?
                                    This action cannot be undone. All tasks, members, and data will be permanently removed.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                                    {isLoading ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </Card>
    );
}