"use client";

import { useState } from "react";
import { TeamHeader } from "./TeamHeader";
import { TeamFilters } from "./TeamFilters";
import { TeamTable } from "./TeamTable";

interface TeamClientProps {
    initialMembers: any;
    initialProjects: Array<{ id: string; name: string }>;
    userRole: string;
    currentUserId: string;
}

export function TeamClient({ 
    initialMembers, 
    initialProjects, 
    userRole, 
    currentUserId 
}: TeamClientProps) {
    const [search, setSearch] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState("all");

    const members = initialMembers?.members || [];
    const projects = initialProjects;

    const canInvite = userRole === "ADMIN" || userRole === "PROJECT_MANAGER";
    const canChangeRole = userRole === "ADMIN";

    // Filter members by search and project
    const filteredMembers = members.filter((member: any) => {
        // Search filter
        const matchesSearch = 
            member.name.toLowerCase().includes(search.toLowerCase()) ||
            member.email.toLowerCase().includes(search.toLowerCase());
        
        // Project filter
        let matchesProject = true;
        if (selectedProjectId !== "all") {
            matchesProject = member.projectIds?.includes(selectedProjectId) || false;
        }
        
        return matchesSearch && matchesProject;
    });

    return (
        <div className="space-y-6">
            <TeamHeader 
                canInvite={canInvite} 
                userProjects={projects}
            />
            
            <TeamFilters
                search={search}
                selectedProjectId={selectedProjectId}
                projects={projects}
                onSearchChange={setSearch}
                onProjectChange={setSelectedProjectId}
            />
            
            <TeamTable
                members={filteredMembers}
                canChangeRole={canChangeRole}
                userRole={userRole}
                currentUserId={currentUserId}
            />
        </div>
    );
}