"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUser } from "@/actions/admin.action";

interface AdminUserDangerZoneProps {
    user: any;
    onRefresh: () => void;
}

export function AdminUserDangerZone({ user, onRefresh }: AdminUserDangerZoneProps) {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [confirmName, setConfirmName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (confirmName !== user.name) {
            toast.error("Name confirmation does not match");
            return;
        }

        setIsLoading(true);
        try {
            const result = await deleteUser(user.id);
            if (result.success) {
                toast.success(`User ${user.name} has been deleted`);
                router.push("/dashboard/admin/users");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to delete user");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions for this user account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Delete User Account</p>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete this user and all associated data. This action cannot be undone.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete {user.name}'s account?
                            This action cannot be undone and will remove all associated data including tasks, projects, and activities.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="confirmName">
                                Type <span className="font-bold">{user.name}</span> to confirm
                            </Label>
                            <Input
                                id="confirmName"
                                placeholder="Enter user name"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isLoading || confirmName !== user.name}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Permanently Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}