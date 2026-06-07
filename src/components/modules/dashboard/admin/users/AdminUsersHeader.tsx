"use client";

import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";

interface AdminUsersHeaderProps {
    onInvite: () => void;
}

export function AdminUsersHeader({ onInvite }: AdminUsersHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Users className="h-8 w-8 text-indigo-600" />
                    User Management
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage platform users, roles, and account statuses.
                </p>
            </div>
            <Button onClick={onInvite} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <UserPlus className="h-4 w-4" />
                Invite User
            </Button>
        </div>
    );
}