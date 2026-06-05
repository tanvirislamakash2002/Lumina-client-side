"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, UserMinus, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { removeMember, getAvailableMembers, addMember } from "@/actions/project-member.action";

interface ProjectMembersTabProps {
    members: any;
    projectId: string;
    canEdit: boolean;
    userRole: string;
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function ProjectMembersTab({ members, projectId, canEdit }: ProjectMembersTabProps) {
    const [search, setSearch] = useState("");
    const [availableMembers, setAvailableMembers] = useState<any[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const memberList = members?.members || [];
    const filteredMembers = memberList.filter((member: any) =>
        member.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleRemoveMember = async (memberId: string, memberName: string) => {
        const toastId = toast.loading(`Removing ${memberName}...`);
        const result = await removeMember(projectId, memberId);
        if (result.success) {
            toast.success(`${memberName} removed from project`, { id: toastId });
        } else {
            toast.error(result.message || "Failed to remove member", { id: toastId });
        }
    };

    const handleOpenAddDialog = async () => {
        setIsAddDialogOpen(true);
        setIsLoading(true);
        const result = await getAvailableMembers(projectId);
        if (result.success) {
            setAvailableMembers(result.data || []);
        }
        setIsLoading(false);
    };

    const handleAddMember = async (memberId: string, memberName: string) => {
        const toastId = toast.loading(`Adding ${memberName}...`);
        const result = await addMember(projectId, memberId);
        if (result.success) {
            toast.success(`${memberName} added to project`, { id: toastId });
            setIsAddDialogOpen(false);
        } else {
            toast.error(result.message || "Failed to add member", { id: toastId });
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleLabel = (role: string) => {
        if (role === "PROJECT_MANAGER") return "Project Manager";
        if (role === "TEAM_MEMBER") return "Team Member";
        return role;
    };

    if (memberList.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Team Members</CardTitle>
                    {canEdit && (
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" onClick={handleOpenAddDialog}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Team Member</DialogTitle>
                                    <DialogDescription>
                                        Select a user to add to this project.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <p className="text-center py-4">Loading...</p>
                                    ) : availableMembers.length === 0 ? (
                                        <p className="text-center py-4 text-muted-foreground">
                                            No available members to add.
                                        </p>
                                    ) : (
                                        availableMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-3 rounded-lg border"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={member.image || undefined} />
                                                        <AvatarFallback>
                                                            {getInitials(member.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{member.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {getRoleLabel(member.role)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAddMember(member.id, member.name)}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        No team members yet. Add members to collaborate.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                <CardTitle>Team Members ({memberList.length})</CardTitle>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search members..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 w-64"
                        />
                    </div>
                    {canEdit && (
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" onClick={handleOpenAddDialog}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Team Member</DialogTitle>
                                    <DialogDescription>
                                        Select a user to add to this project.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <p className="text-center py-4">Loading...</p>
                                    ) : availableMembers.length === 0 ? (
                                        <p className="text-center py-4 text-muted-foreground">
                                            No available members to add.
                                        </p>
                                    ) : (
                                        availableMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-3 rounded-lg border"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={member.image || undefined} />
                                                        <AvatarFallback>
                                                            {getInitials(member.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{member.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {getRoleLabel(member.role)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAddMember(member.id, member.name)}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {filteredMembers.map((member: any) => (
                        <div
                            key={member.id}
                            className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={member.image || undefined} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                        {getInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={roleColors[member.role]}>
                                    {getRoleLabel(member.role)}
                                </Badge>
                                {member.taskCount !== undefined && (
                                    <span className="text-sm text-muted-foreground">
                                        {member.completedTasks || 0}/{member.taskCount || 0} tasks
                                    </span>
                                )}
                                {canEdit && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                <UserMinus className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to remove {member.name} from this project?
                                                    They will lose access to all project tasks.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleRemoveMember(member.id, member.name)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Remove
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMembers.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                        No members match your search.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}