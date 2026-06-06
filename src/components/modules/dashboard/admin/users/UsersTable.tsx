"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Shield, Ban, UserCheck, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import { updateUserRole } from "@/actions/user.action";
import { suspendUser, activateUser, deleteUser } from "@/actions/admin.action";

interface UsersTableProps {
    users: any[];
    currentUserId: string;
    selectedUsers: string[];
    onSelectUser: (userId: string) => void;
    onSelectAll: () => void;
    allSelected: boolean;
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    PROJECT_MANAGER: "Project Manager",
    TEAM_MEMBER: "Team Member",
};

const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
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

export function UsersTable({
    users,
    currentUserId,
    selectedUsers,
    onSelectUser,
    onSelectAll,
    allSelected,
}: UsersTableProps) {
    const handleRoleChange = async (userId: string, newRole: string) => {
        const toastId = toast.loading("Updating user role...");
        const result = await updateUserRole(userId, newRole);
        if (result.success) {
            toast.success(`User role updated`, { id: toastId });
        } else {
            toast.error(result.message || "Failed to update role", { id: toastId });
        }
    };

    const handleSuspendUser = async (userId: string, userName: string) => {
        const toastId = toast.loading(`Suspending ${userName}...`);
        const result = await suspendUser(userId);
        if (result.success) {
            toast.success(`${userName} suspended`, { id: toastId });
        } else {
            toast.error(result.message || "Failed to suspend user", { id: toastId });
        }
    };

    const handleActivateUser = async (userId: string, userName: string) => {
        const toastId = toast.loading(`Activating ${userName}...`);
        const result = await activateUser(userId);
        if (result.success) {
            toast.success(`${userName} activated`, { id: toastId });
        } else {
            toast.error(result.message || "Failed to activate user", { id: toastId });
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        const toastId = toast.loading(`Deleting ${userName}...`);
        const result = await deleteUser(userId);
        if (result.success) {
            toast.success(`${userName} deleted`, { id: toastId });
        } else {
            toast.error(result.message || "Failed to delete user", { id: toastId });
        }
    };

    if (users.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Shield className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No users found</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        Try adjusting your search or filters
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="divide-y">
                    {/* Header Row */}
                    <div className="hidden md:flex items-center gap-4 p-4 bg-muted/30 text-sm font-medium">
                        <div className="w-8">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onSelectAll}
                            />
                        </div>
                        <div className="w-10" />
                        <div className="flex-1">User</div>
                        <div className="w-28">Role</div>
                        <div className="w-24">Status</div>
                        <div className="w-20">Verified</div>
                        <div className="w-24">Tasks</div>
                        <div className="w-24">Projects</div>
                        <div className="w-28">Joined</div>
                        <div className="w-28">Actions</div>
                    </div>

                    {users.map((user) => {
                        const isCurrentUser = user.id === currentUserId;
                        return (
                            <div
                                key={user.id}
                                className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                            >
                                {/* Checkbox */}
                                <div className="w-8">
                                    <Checkbox
                                        checked={selectedUsers.includes(user.id)}
                                        onCheckedChange={() => onSelectUser(user.id)}
                                    />
                                </div>

                                {/* Avatar */}
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarImage src={user.image || undefined} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium truncate">{user.name}</p>
                                        {isCurrentUser && (
                                            <Badge variant="secondary" className="text-xs">
                                                You
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {user.email}
                                    </p>
                                </div>

                                {/* Role */}
                                <div className="w-28">
                                    {!isCurrentUser ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8">
                                                    <Badge className={roleColors[user.role]}>
                                                        {roleLabels[user.role]}
                                                    </Badge>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")}>
                                                    Admin
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, "PROJECT_MANAGER")}>
                                                    Project Manager
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, "TEAM_MEMBER")}>
                                                    Team Member
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <Badge className={roleColors[user.role]}>
                                            {roleLabels[user.role]}
                                        </Badge>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="w-24">
                                    <Badge className={statusColors[user.accountStatus]}>
                                        {user.accountStatus}
                                    </Badge>
                                </div>

                                {/* Verified */}
                                <div className="w-20">
                                    {user.emailVerified ? (
                                        <Badge variant="outline" className="text-green-600">
                                            Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-amber-600">
                                            Unverified
                                        </Badge>
                                    )}
                                </div>

                                {/* Tasks Count */}
                                <div className="w-24 text-sm text-muted-foreground">
                                    {user._count?.assignedTasks || 0}
                                </div>

                                {/* Projects Count */}
                                <div className="w-24 text-sm text-muted-foreground">
                                    {user._count?.projectMembers || 0}
                                </div>

                                {/* Joined Date */}
                                <div className="w-28 text-sm text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </div>

                                {/* Actions */}
                                <div className="w-28 flex items-center gap-1">
                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                        <Link href={`/team/${user.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>

                                    {!isCurrentUser && user.accountStatus === "ACTIVE" && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600">
                                                    <Ban className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Suspend User</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to suspend {user.name}? They will not be able to access the platform.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleSuspendUser(user.id, user.name)}
                                                        className="bg-amber-600 hover:bg-amber-700"
                                                    >
                                                        Suspend
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}

                                    {!isCurrentUser && user.accountStatus === "SUSPENDED" && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                                    <UserCheck className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Activate User</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to activate {user.name}? They will regain access to the platform.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleActivateUser(user.id, user.name)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Activate
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}

                                    {!isCurrentUser && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete {user.name}? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}