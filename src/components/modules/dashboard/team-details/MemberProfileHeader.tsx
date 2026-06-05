"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Briefcase, User, Calendar, Shield } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateUserRole } from "@/actions/user.action";

interface MemberProfileHeaderProps {
    user: any;
    canChangeRole: boolean;
    isOwnProfile: boolean;
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

export function MemberProfileHeader({ user, canChangeRole, isOwnProfile }: MemberProfileHeaderProps) {
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [isLoading, setIsLoading] = useState(false);

    const RoleIcon = roleIcons[user.role] || User;

    const handleRoleChange = async () => {
        if (selectedRole === user.role) {
            setIsRoleDialogOpen(false);
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Updating user role...");
        const result = await updateUserRole(user.id, selectedRole);

        if (result.success) {
            toast.success(`Role updated to ${getRoleLabel(selectedRole)}`, { id: toastId });
            setIsRoleDialogOpen(false);
            // Refresh the page to show updated role
            window.location.reload();
        } else {
            toast.error(result.message || "Failed to update role", { id: toastId });
        }
        setIsLoading(false);
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Avatar */}
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            {isOwnProfile && (
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                                    You
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={roleColors[user.role]}>
                                <RoleIcon className="h-3 w-3 mr-1" />
                                {getRoleLabel(user.role)}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Member since {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {canChangeRole && !isOwnProfile && (
                        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Change Role
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change User Role</DialogTitle>
                                    <DialogDescription>
                                        Update the role for {user.name}. This will affect their permissions across the entire platform.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Select New Role</Label>
                                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                                                <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleRoleChange} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                                        {isLoading ? "Updating..." : "Confirm Change"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}