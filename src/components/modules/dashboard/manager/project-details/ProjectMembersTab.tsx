"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Plus, Search, UserPlus, Trash2, Mail, AlertCircle } from "lucide-react";
import { addMember, removeMember, getAvailableMembers } from "@/actions/project-member.action";
import { toast } from "sonner";

interface ProjectMembersTabProps {
    projectId: string;
    initialMembers: any[];
    canEdit: boolean;
    onMemberUpdate: () => void;
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function ProjectMembersTab({
    projectId,
    initialMembers,
    canEdit,
    onMemberUpdate,
}: ProjectMembersTabProps) {
    const [members, setMembers] = useState(initialMembers);
    const [search, setSearch] = useState("");
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [availableMembers, setAvailableMembers] = useState<any[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchAvailableMembers = async () => {
        if (!addDialogOpen) return;
        setIsLoading(true);
        try {
            const result = await getAvailableMembers(projectId);
            if (result.success) {
                setAvailableMembers(result.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch available members:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedMemberId) {
            toast.error("Please select a member");
            return;
        }

        const result = await addMember(projectId, selectedMemberId);
        if (result.success) {
            toast.success("Member added successfully");
            setAddDialogOpen(false);
            setSelectedMemberId("");
            onMemberUpdate();
        } else {
            toast.error(result.message || "Failed to add member");
        }
    };

    const handleRemoveMember = async (memberId: string, memberName: string) => {
        if (!confirm(`Are you sure you want to remove ${memberName} from this project?`)) return;

        const result = await removeMember(projectId, memberId);
        if (result.success) {
            toast.success(`${memberName} removed from project`);
            onMemberUpdate();
        } else {
            toast.error(result.message || "Failed to remove member");
        }
    };

    const filteredMembers = members.filter((member) =>
        member.name?.toLowerCase().includes(search.toLowerCase()) ||
        member.email?.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                {canEdit && (
                    <Dialog
                        open={addDialogOpen}
                        onOpenChange={(open) => {
                            setAddDialogOpen(open);
                            if (open) fetchAvailableMembers();
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2">
                                <UserPlus className="h-4 w-4" />
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
                            <div className="py-4">
                                <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoading ? (
                                            <SelectItem value="loading" disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : availableMembers.length === 0 ? (
                                            <SelectItem value="none" disabled>
                                                No available members
                                            </SelectItem>
                                        ) : (
                                            availableMembers.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{member.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            ({member.email})
                                                        </span>
                                                        <Badge className={roleColors[member.role]}>
                                                            {member.role.replace("_", " ")}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddMember} disabled={!selectedMemberId}>
                                    Add Member
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Members List */}
                {filteredMembers.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="p-3 rounded-full bg-muted w-fit mx-auto mb-3">
                            <UsersIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No members found</h3>
                        <p className="text-sm text-muted-foreground">
                            {search ? "Try a different search term" : "No members in this project yet"}
                        </p>
                        {canEdit && !search && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setAddDialogOpen(true)}
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add First Member
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-3 rounded-lg border"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={member.image || undefined} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                            {getInitials(member.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium">{member.name}</p>
                                            <Badge className={roleColors[member.role]}>
                                                {member.role.replace("_", " ")}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                                {member.email}
                                            </span>
                                        </div>
                                        {member.taskCount !== undefined && (
                                            <div className="mt-2 space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Task Progress</span>
                                                    <span>{member.completionRate || 0}%</span>
                                                </div>
                                                <Progress value={member.completionRate || 0} className="h-1.5" />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>{member.completedTasks || 0} completed</span>
                                                    <span>{member.taskCount || 0} total tasks</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {canEdit && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRemoveMember(member.id, member.name)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function UsersIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>;
}