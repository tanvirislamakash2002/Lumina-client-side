"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateUserRole, suspendUser, activateUser, deleteUser } from "@/actions/admin.action";
import { Loader2, Shield, UserX, UserCheck, Trash2 } from "lucide-react";

interface TeamMemberAdminActionsProps {
    user: any;
    isAdmin: boolean;
    isOwnProfile: boolean;
    onRefresh: () => void;
}

export function TeamMemberAdminActions({ user, isAdmin, isOwnProfile, onRefresh }: TeamMemberAdminActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [newRole, setNewRole] = useState(user.role);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleRoleChange = async () => {
        if (newRole === user.role) {
            setRoleDialogOpen(false);
            return;
        }
        setIsLoading(true);
        try {
            const result = await updateUserRole(user.id, newRole);
            if (result.success) {
                toast.success(`Role changed to ${newRole.replace("_", " ")}`);
                setRoleDialogOpen(false);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to update role");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuspend = async () => {
        setIsLoading(true);
        try {
            const result = await suspendUser(user.id);
            if (result.success) {
                toast.success(`${user.name} has been suspended`);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to suspend user");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivate = async () => {
        setIsLoading(true);
        try {
            const result = await activateUser(user.id);
            if (result.success) {
                toast.success(`${user.name} has been activated`);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to activate user");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const result = await deleteUser(user.id);
            if (result.success) {
                toast.success(`User account deleted`);
                router.push("/dashboard/team");
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

    // Only show admin actions for Admin users, and not for own profile (can't change own role/suspend self)
    if (!isAdmin || isOwnProfile) {
        return null;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Admin Actions</CardTitle>
                    <CardDescription>
                        Manage user account and permissions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Change Role */}
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Change Role</p>
                                <p className="text-sm text-muted-foreground">
                                    Update user permissions and access level.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setNewRole(user.role);
                                setRoleDialogOpen(true);
                            }}
                        >
                            Change Role
                        </Button>
                    </div>

                    {/* Suspend/Activate */}
                    {user.accountStatus === "ACTIVE" ? (
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <UserX className="h-5 w-5 text-red-500" />
                                <div>
                                    <p className="font-medium">Suspend Account</p>
                                    <p className="text-sm text-muted-foreground">
                                        Prevent user from accessing the platform.
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleSuspend}
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Suspend User
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <UserCheck className="h-5 w-5 text-emerald-500" />
                                <div>
                                    <p className="font-medium">Activate Account</p>
                                    <p className="text-sm text-muted-foreground">
                                        Restore user access to the platform.
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="default"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={handleActivate}
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Activate User
                            </Button>
                        </div>
                    )}

                    {/* Delete Account */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 dark:border-red-900">
                        <div className="flex items-center gap-3">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="font-medium text-red-600">Delete Account</p>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete user and all associated data.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Delete User
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Role Change Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                        <DialogDescription>
                            Update role for {user.name}. This will affect their permissions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="role">New Role</Label>
                        <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                                <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRoleChange} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete {user.name}'s account?
                            This action cannot be undone and will remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}