"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Shield, Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateUserRole } from "@/actions/admin.action";

interface AdminRolesTableProps {
    users: any[];
    currentUserId: string;
    isSuperAdmin: boolean;
    onRefresh: () => void;
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function AdminRolesTable({ users, currentUserId, isSuperAdmin, onRefresh }: AdminRolesTableProps) {
    const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newRole, setNewRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
    const [bulkRole, setBulkRole] = useState("");

    const handleRoleChange = (userId: string, role: string) => {
        setPendingChanges({ ...pendingChanges, [userId]: role });
    };

    const handleSave = async (user: any) => {
        const newRoleValue = pendingChanges[user.id];
        if (!newRoleValue) return;

        setSelectedUser(user);
        setNewRole(newRoleValue);
        setConfirmDialogOpen(true);
    };

    const confirmRoleChange = async () => {
        if (!selectedUser) return;

        setIsLoading(true);
        try {
            const result = await updateUserRole(selectedUser.id, newRole);
            if (result.success) {
                toast.success(`${selectedUser.name}'s role changed to ${newRole.replace("_", " ")}`);
                const newPending = { ...pendingChanges };
                delete newPending[selectedUser.id];
                setPendingChanges(newPending);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to update role");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
            setConfirmDialogOpen(false);
            setSelectedUser(null);
            setNewRole("");
        }
    };

    const handleSelectAll = (checked: boolean) => {
        const nonAdminUsers = users.filter(u => u.role !== "ADMIN" && u.id !== currentUserId);
        if (checked) {
            setSelectedUsers(nonAdminUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const handleBulkUpdate = async () => {
        if (!bulkRole) return;

        setIsLoading(true);
        let successCount = 0;
        let failCount = 0;

        for (const userId of selectedUsers) {
            try {
                const result = await updateUserRole(userId, bulkRole);
                if (result.success) {
                    successCount++;
                } else {
                    failCount++;
                }
            } catch (error) {
                failCount++;
            }
        }

        toast.success(`${successCount} user(s) updated to ${bulkRole.replace("_", " ")}${failCount > 0 ? `, ${failCount} failed` : ""}`);
        setBulkDialogOpen(false);
        setSelectedUsers([]);
        setBulkRole("");
        onRefresh();
        setIsLoading(false);
    };

    const nonAdminUsers = users.filter(u => u.role !== "ADMIN");
    const allSelected = nonAdminUsers.length > 0 && selectedUsers.length === nonAdminUsers.length;

    if (users.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <Shield className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No users found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your filters to find users.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr className="text-left text-sm font-medium">
                                    <th className="w-12 p-4">
                                        <Checkbox
                                            checked={allSelected}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Current Role</th>
                                    <th className="p-4">New Role</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4 w-24"></th>
                                 </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => {
                                    const isCurrentUser = user.id === currentUserId;
                                    const isAdmin = user.role === "ADMIN";
                                    const isSelected = selectedUsers.includes(user.id);
                                    const pendingRole = pendingChanges[user.id];

                                    return (
                                        <tr key={user.id} className={`border-b last:border-0 hover:bg-muted/30 ${isAdmin ? "bg-purple-50/30 dark:bg-purple-950/10" : ""}`}>
                                            <td className="p-4">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                                                    disabled={isAdmin || isCurrentUser}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.image || undefined} />
                                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={`/dashboard/users/${user.id}`}
                                                                className="font-medium hover:text-indigo-600 transition-colors"
                                                            >
                                                                {user.name}
                                                            </Link>
                                                            {isCurrentUser && (
                                                                <Badge variant="secondary" className="text-xs">You</Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={roleColors[user.role]}>
                                                    {user.role === "ADMIN" 
                                                        ? "Admin" 
                                                        : user.role === "PROJECT_MANAGER" 
                                                            ? "Project Manager" 
                                                            : "Team Member"}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {!isAdmin && !isCurrentUser ? (
                                                    <Select
                                                        value={pendingRole || user.role}
                                                        onValueChange={(value) => handleRoleChange(user.id, value)}
                                                    >
                                                        <SelectTrigger className="w-36">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                                                            <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        {isAdmin ? "Cannot modify Admin" : "Cannot modify own role"}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {format(new Date(user.createdAt), "MMM dd, yyyy")}
                                            </td>
                                            <td className="p-4">
                                                {!isAdmin && !isCurrentUser && pendingRole && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSave(user)}
                                                        className="bg-indigo-600 hover:bg-indigo-700"
                                                    >
                                                        Save
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Role Change Confirmation Dialog */}
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Role Change</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to change {selectedUser?.name}'s role?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                            <span className="text-sm">Current Role:</span>
                            <Badge className={roleColors[selectedUser?.role]}>
                                {selectedUser?.role?.replace("_", " ")}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                            <span className="text-sm">New Role:</span>
                            <Badge className={roleColors[newRole]}>
                                {newRole?.replace("_", " ")}
                            </Badge>
                        </div>
                        {newRole === "TEAM_MEMBER" && selectedUser?.role === "PROJECT_MANAGER" && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    Demoting a Project Manager will remove their ability to create and manage projects.
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmRoleChange} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Change
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Update Dialog */}
            <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bulk Role Update</DialogTitle>
                        <DialogDescription>
                            Update role for {selectedUsers.length} selected user(s).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={bulkRole} onValueChange={setBulkRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select new role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                                <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleBulkUpdate} disabled={isLoading || !bulkRole}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update {selectedUsers.length} User(s)
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Action Button */}
            {selectedUsers.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        onClick={() => setBulkDialogOpen(true)}
                        className="shadow-lg gap-2 bg-indigo-600 hover:bg-indigo-700"
                    >
                        Update Selected ({selectedUsers.length})
                    </Button>
                </div>
            )}
        </>
    );
}