"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MemberTeamHeader } from "./MemberTeamHeader";
import { MemberTeamFilterBar } from "./MemberTeamFilterBar";
import { MemberTeamGrid } from "./MemberTeamGrid";

interface MemberTeamClientProps {
    members: any[];
    totalMembers: number;
    currentSearch: string;
    currentRole: string;
}

export function MemberTeamClient({
    members,
    totalMembers,
    currentSearch,
    currentRole,
}: MemberTeamClientProps) {
    const router = useRouter();

    const handleSearch = (search: string, role: string) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (role && role !== "all") params.set("role", role);
        router.push(`/dashboard/team?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <MemberTeamHeader totalMembers={totalMembers} />

            <MemberTeamFilterBar
                onSearch={handleSearch}
                currentSearch={currentSearch}
                currentRole={currentRole}
            />

            <MemberTeamGrid members={members} />
        </div>
    );
}