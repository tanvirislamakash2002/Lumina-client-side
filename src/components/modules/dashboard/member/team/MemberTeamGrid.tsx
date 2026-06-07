"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import Link from "next/link";

interface MemberTeamGridProps {
    members: any[];
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function MemberTeamGrid({ members }: MemberTeamGridProps) {
    if (members.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-muted">
                            <UsersIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No members found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Try adjusting your search or filter to find team members.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            You'll only see members from projects you're part of.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
                <Link key={member.id} href={`/dashboard/team/${member.id}`} className="block">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={member.image || undefined} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                        {getInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{member.name}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground truncate">
                                            {member.email}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <Badge className={roleColors[member.role]}>
                                            {member.role === "ADMIN"
                                                ? "Admin"
                                                : member.role === "PROJECT_MANAGER"
                                                    ? "Project Manager"
                                                    : "Team Member"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

function UsersIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}