"use client";

import { Users } from "lucide-react";

interface MemberTeamHeaderProps {
    totalMembers: number;
}

export function MemberTeamHeader({ totalMembers }: MemberTeamHeaderProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Users className="h-8 w-8 text-indigo-600" />
                Team Members
            </h1>
            <p className="text-muted-foreground mt-1">
                People you collaborate with across your projects. ({totalMembers} members)
            </p>
        </div>
    );
}