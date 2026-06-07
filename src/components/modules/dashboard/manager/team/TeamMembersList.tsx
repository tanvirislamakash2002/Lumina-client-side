"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { MoreHorizontal, Mail, Briefcase, CheckCircle, Clock, AlertCircle, Shield, UserX, UserCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { updateUserRole, suspendUser, activateUser } from "@/actions/admin.action";

interface TeamMembersListProps {
    users: any[];
    isAdmin: boolean;
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

export function TeamMembersList({ users, isAdmin, onRefresh }: TeamMembersListProps) {
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newRole, setNewRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (users.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <UsersIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No members found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your filters to find team members.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

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

    return (
        <>
            <div className="space-y-4">
                {users.map((user) => {
                    const completionRate = user._count?.assignedTasks === 0
                        ? 0
                        : Math.round((user._count?.assignedTasks || 0) / (user._count?.assignedTasks || 1) * 100);

                    return (
                        <Card key={user.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* User Info */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.image || undefined} />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold">{user.name}</h3>
                                                <Badge className={roleColors[user.role]}>
                                                    {user.role.replace("_", " ")}
                                                </Badge>
                                                {user.accountStatus === "SUSPENDED" && (
                                                    <Badge className={statusColors.SUSPENDED}>
                                                        Suspended
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="h-3 w-3 text-muted-foreground" />
                                                    {user._count?.assignedTasks || 0} tasks
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                                                    {user._count?.projectMembers || 0} projects
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Workload Progress */}
                                    <div className="min-w-[200px]">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Completion Rate</span>
                                                <span>{completionRate}%</span>
                                            </div>
                                            <Progress value={completionRate} className="h-2" />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/dashboard/tasks?assignedTo=${user.id}`}>
                                                View Tasks
                                            </Link>
                                        </Button>

                                        {isAdmin && user.role !== "ADMIN" && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
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
                                                    {user.accountStatus === "ACTIVE" ? (
                                                        <DropdownMenuItem
                                                            onClick={() => handleSuspend(user)}
                                                            className="text-red-600"
                                                        >
                                                            <UserX className="h-4 w-4 mr-2" />
                                                            Suspend User
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() => handleActivate(user)}
                                                            className="text-emerald-600"
                                                        >
                                                            <UserCheck className="h-4 w-4 mr-2" />
                                                            Activate User
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

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
                            {isLoading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
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

function LoaderIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}