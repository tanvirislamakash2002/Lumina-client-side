"use client";

import { UserCheck } from "lucide-react";

export function MemberMyTasksHeader() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <UserCheck className="h-8 w-8 text-indigo-600" />
                My Tasks
            </h1>
            <p className="text-muted-foreground mt-1">
                Tasks assigned to you. Track your progress and update status.
            </p>
        </div>
    );
}