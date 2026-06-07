"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Shield, UserX, UserCheck, Trash2, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateUserRole, suspendUser, activateUser, deleteUser } from "@/actions/admin.action";

interface AdminUsersTableProps {
    users: any[];
    currentUserId: string;
    onRefresh: () => void;
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function AdminUsersTable({ users, currentUserId, onRefresh }: AdminUsersTableProps) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newRole, setNewRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(users.map((u) => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        }
    };

    const handleRoleChange = async () => {
        if (!selectedUser || !newRole) return;
        setIsLoading(true);
        try {
            const result = await updateUserRole(selectedUser.id, newRole);
            if (result.success) {
                toast.success(`Changed ${selectedUser.name}'s role to ${newRole.replace("_", " ")}`);
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

    const handleSuspend = async (user: any) => {
        if (!confirm(`Are you sure you want to suspend ${user.name}?`)) return;
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

    const handleActivate = async (user: any) => {
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

    const handleDelete = async (user: any) => {
        if (!confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) return;
        setIsLoading(true);
        try {
            const result = await deleteUser(user.id);
            if (result.success) {
                toast.success(`${user.name} has been deleted`);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to delete user");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (users.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <UsersIcon className="h-10 w-10 text-muted-foreground" />
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
                                            checked={users.length > 0 && selectedUsers.length === users.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Verified</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4">Tasks</th>
                                    <th className="p-4">Projects</th>
                                    <th className="p-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => {
                                    const isSelected = selectedUsers.includes(user.id);
                                    const isCurrentUser = user.id === currentUserId;

                                    return (
                                        <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="p-4">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                                                    disabled={isCurrentUser}
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
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
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
                                                <Badge className={statusColors[user.accountStatus]}>
                                                    {user.accountStatus}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {user.emailVerified ? (
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                                        Unverified
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {format(new Date(user.createdAt), "MMM dd, yyyy")}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {user._count?.assignedTasks || 0}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {user._count?.projectMembers || 0}
                                            </td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/team/${user.id}`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Profile
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {!isCurrentUser && user.role !== "ADMIN" && (
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setNewRole(user.role);
                                                                    setRoleDialogOpen(true);
                                                                }}
                                                            >
                                                                <Shield className="h-4 w-4 mr-2" />
                                                                Change Role
                                                            </DropdownMenuItem>
                                                        )}
                                                        {!isCurrentUser && user.accountStatus === "ACTIVE" ? (
                                                            <DropdownMenuItem
                                                                onClick={() => handleSuspend(user)}
                                                                className="text-red-600"
                                                            >
                                                                <UserX className="h-4 w-4 mr-2" />
                                                                Suspend User
                                                            </DropdownMenuItem>
                                                        ) : !isCurrentUser && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleActivate(user)}
                                                                className="text-emerald-600"
                                                            >
                                                                <UserCheck className="h-4 w-4 mr-2" />
                                                                Activate User
                                                            </DropdownMenuItem>
                                                        )}
                                                        {!isCurrentUser && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(user)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete User
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Role Change Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                        <DialogDescription>
                            Update role for {selectedUser?.name}. This will affect their permissions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={newRole} onValueChange={setNewRole}>
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
        </>
    );
}

function UsersIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}