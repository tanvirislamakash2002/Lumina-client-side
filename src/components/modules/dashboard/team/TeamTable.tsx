"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Crown, Briefcase, User, Star } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface TeamTableProps {
    members: any[];
    canChangeRole: boolean;
    userRole: string;
    currentUserId: string;
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const roleIcons: Record<string, any> = {
    ADMIN: Crown,
    PROJECT_MANAGER: Briefcase,
    TEAM_MEMBER: User,
};

const getRoleLabel = (role: string) => {
    if (role === "PROJECT_MANAGER") return "Project Manager";
    if (role === "TEAM_MEMBER") return "Team Member";
    return role;
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function TeamTable({ members, canChangeRole, userRole, currentUserId }: TeamTableProps) {
    const handleRoleChange = async (userId: string, newRole: string, currentRole: string) => {
        if (newRole === currentRole) return;

        const toastId = toast.loading("Updating user role...");
        const result = await updateUserRole(userId, newRole);
        
        if (result.success) {
            toast.success(`User role updated to ${getRoleLabel(newRole)}`, { id: toastId });
        } else {
            toast.error(result.message || "Failed to update role", { id: toastId });
        }
    };

    if (members.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No members found</h3>
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
                    {members.map((member) => {
                        const RoleIcon = roleIcons[member.role] || User;
                        const isCurrentUser = member.id === currentUserId;
                        
                        return (
                            <div
                                key={member.id}
                                className={cn(
                                    "flex flex-wrap items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                                    isCurrentUser && "bg-indigo-50/50 dark:bg-indigo-950/20"
                                )}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <Avatar className="h-10 w-10 flex-shrink-0">
                                        <AvatarImage src={member.image || undefined} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                            {getInitials(member.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isCurrentUser && (
                                        <div className="absolute -top-1 -right-1">
                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium truncate">
                                            {member.name}
                                            {isCurrentUser && (
                                                <span className="text-xs text-muted-foreground ml-1">(You)</span>
                                            )}
                                        </p>
                                        <Badge className={roleColors[member.role]}>
                                            <RoleIcon className="h-3 w-3 mr-1" />
                                            {getRoleLabel(member.role)}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {member.email}
                                    </p>
                                    {member._count && (
                                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                                            <span>{member._count.assignedTasks || 0} tasks</span>
                                            <span>•</span>
                                            <span>{member._count.projectMembers || 0} projects</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/team/${member.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    
                                    {/* Don't show change role for current user */}
                                    {canChangeRole && member.id !== currentUserId && member.role !== "ADMIN" && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    Change Role
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(member.id, "PROJECT_MANAGER", member.role)}
                                                    disabled={member.role === "PROJECT_MANAGER"}
                                                >
                                                    <Briefcase className="mr-2 h-4 w-4" />
                                                    Project Manager
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(member.id, "TEAM_MEMBER", member.role)}
                                                    disabled={member.role === "TEAM_MEMBER"}
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    Team Member
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                    
                                    {/* Admin role change - special case, don't allow self-change */}
                                    {canChangeRole && member.id !== currentUserId && member.role === "ADMIN" && userRole === "ADMIN" && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    Change Role
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Change Admin Role</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to change {member.name}'s role from Admin?
                                                        This action will remove their administrative privileges.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleRoleChange(member.id, "TEAM_MEMBER", member.role)}
                                                        className="bg-amber-600 hover:bg-amber-700"
                                                    >
                                                        Confirm Change
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