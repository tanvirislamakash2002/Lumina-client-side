"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Ban, UserCheck, Trash2, Download } from "lucide-react";
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
import { bulkUserAction } from "@/actions/admin.action";

interface BulkActionsBarProps {
    selectedCount: number;
    selectedUsers: string[];
    onClearSelection: () => void;
}

export function BulkActionsBar({ selectedCount, selectedUsers, onClearSelection }: BulkActionsBarProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState<string | null>(null);

    const handleBulkAction = async (actionType: string) => {
        setIsLoading(true);
        const toastId = toast.loading(`Performing bulk ${actionType}...`);
        const result = await bulkUserAction(actionType, selectedUsers);
        if (result.success) {
            toast.success(result.message, { id: toastId });
            onClearSelection();
        } else {
            toast.error(result.message || `Failed to ${actionType} users`, { id: toastId });
        }
        setIsLoading(false);
    };

    return (
        <Card className="p-3 bg-muted/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                        {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
                    </span>
                    <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8 px-2">
                        <X className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                </div>

                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-amber-600">
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bulk Suspend Users</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to suspend {selectedCount} user{selectedCount !== 1 ? "s" : ""}?
                                    They will not be able to access the platform.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBulkAction("suspend")} className="bg-amber-600">
                                    Suspend
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-green-600">
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activate
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bulk Activate Users</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to activate {selectedCount} user{selectedCount !== 1 ? "s" : ""}?
                                    They will regain access to the platform.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBulkAction("activate")} className="bg-green-600">
                                    Activate
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bulk Delete Users</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete {selectedCount} user{selectedCount !== 1 ? "s" : ""}?
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBulkAction("delete")} className="bg-red-600">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </Card>
    );
}