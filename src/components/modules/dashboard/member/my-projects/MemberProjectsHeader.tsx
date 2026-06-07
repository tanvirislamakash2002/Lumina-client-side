"use client";

import { FolderKanban } from "lucide-react";

export function MemberProjectsHeader() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <FolderKanban className="h-8 w-8 text-indigo-600" />
                My Projects
            </h1>
            <p className="text-muted-foreground mt-1">
                Projects you're a member of. Track progress and collaborate with your team.
            </p>
        </div>
    );
}