"use client";

import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import Link from "next/link";

interface TeamHeaderProps {
    totalMembers: number;
    isAdmin: boolean;
}

export function TeamHeader({ totalMembers, isAdmin }: TeamHeaderProps) {
    return (
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
            {isAdmin && (
                <Button asChild className="gap-2">
                    <Link href="/admin/users/invite">
                        <UserPlus className="h-4 w-4" />
                        Invite Member
                    </Link>
                </Button>
            )}
        </div>
    );
}