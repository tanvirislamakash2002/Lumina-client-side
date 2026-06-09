"use client";

import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import { getProjects } from "@/actions/project.action";
import { getAvailableMembers } from "@/actions/project-member.action";
import { addMember } from "@/actions/project-member.action";
import { toast } from "sonner";

interface TeamHeaderProps {
    totalMembers: number;
    isAdmin: boolean;
    projects?: { id: string; name: string }[];
    onRefresh?: () => void;
}

export function TeamHeader({ totalMembers, isAdmin, projects = [], onRefresh }: TeamHeaderProps) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [availableMembers, setAvailableMembers] = useState<any[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const fetchAvailableMembers = async (projectId: string) => {
        if (!projectId) return;
        setIsLoadingMembers(true);
        try {
            const result = await getAvailableMembers(projectId);
            if (result.success) {
                setAvailableMembers(result.data || []);
                setSelectedMemberId("");
            }
        } catch (error) {
            console.error("Failed to fetch available members:", error);
        } finally {
            setIsLoadingMembers(false);
        }
    };

    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId);
        if (projectId) {
            fetchAvailableMembers(projectId);
        } else {
            setAvailableMembers([]);
        }
    };

    const handleAddMember = async () => {
        if (!selectedProjectId || !selectedMemberId) {
            toast.error("Please select both a project and a member");
            return;
        }

        setIsAdding(true);
        try {
            const result = await addMember(selectedProjectId, selectedMemberId);
            if (result.success) {
                toast.success("Member added to project successfully");
                setAddDialogOpen(false);
                setSelectedProjectId("");
                setSelectedMemberId("");
                setAvailableMembers([]);
                if (onRefresh) onRefresh();
            } else {
                toast.error(result.message || "Failed to add member");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-8 w-8 text-indigo-600" />
                        Team Members
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your team members and their workloads. ({totalMembers} total)
                    </p>
                </div>
                <div className="flex gap-2">
                    {isAdmin && (
                        <Button asChild className="gap-2">
                            <Link href="/admin/users/invite">
                                <UserPlus className="h-4 w-4" />
                                Invite User
                            </Link>
                        </Button>
                    )}
                    {/* Add to Project Button - visible for both Admin and PM */}
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setAddDialogOpen(true)}
                    >
                        <UserPlus className="h-4 w-4" />
                        Add to Project
                    </Button>
                </div>
            </div>

            {/* Add Member to Project Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Member to Project</DialogTitle>
                        <DialogDescription>
                            Select a project and a member to add them to that project.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Project Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Project</label>
                            <Select value={selectedProjectId} onValueChange={handleProjectChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a project..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem key={project.id} value={project.id}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Member Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Member</label>
                            <Select
                                value={selectedMemberId}
                                onValueChange={setSelectedMemberId}
                                disabled={!selectedProjectId || isLoadingMembers}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={
                                        isLoadingMembers
                                            ? "Loading members..."
                                            : !selectedProjectId
                                                ? "Select a project first"
                                                : "Choose a member..."
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableMembers.length === 0 && !isLoadingMembers ? (
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
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddMember}
                            disabled={!selectedProjectId || !selectedMemberId || isAdding}
                        >
                            {isAdding ? "Adding..." : "Add Member"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}