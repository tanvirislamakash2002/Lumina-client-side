"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { InviteMemberForm } from "./InviteMemberForm";
import { Label } from "@/components/ui/label";

interface TeamHeaderProps {
    canInvite: boolean;
    userProjects?: Array<{ id: string; name: string }>;
}

export function TeamHeader({ canInvite, userProjects = [] }: TeamHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState("");

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
                <p className="text-muted-foreground mt-1">
                    View all team members and their roles
                </p>
            </div>
            {canInvite && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                            <DialogDescription>
                                Select a project and add an existing user to it.
                            </DialogDescription>
                        </DialogHeader>
                        
                        {/* Project Selection */}
                        {userProjects.length > 0 && (
                            <div className="space-y-2">
                                <Label>Select Project</Label>
                                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userProjects.map((project) => (
                                            <SelectItem key={project.id} value={project.id}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        
                        {selectedProjectId && (
                            <InviteMemberForm 
                                projectId={selectedProjectId}
                                onClose={() => {
                                    setIsOpen(false);
                                    setSelectedProjectId("");
                                }} 
                            />
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}