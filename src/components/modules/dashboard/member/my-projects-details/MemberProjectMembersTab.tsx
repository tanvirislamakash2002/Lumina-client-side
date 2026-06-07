"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Mail } from "lucide-react";

interface MemberProjectMembersTabProps {
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

export function MemberProjectMembersTab({ members }: MemberProjectMembersTabProps) {
    const [search, setSearch] = useState("");

    const filteredMembers = members.filter((member) =>
        member.name?.toLowerCase().includes(search.toLowerCase()) ||
        member.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (members.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No members in this project yet.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Team Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Members List */}
                <div className="space-y-3">
                    {filteredMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={member.image || undefined} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                        {getInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium">{member.name}</p>
                                        <Badge className={roleColors[member.role]}>
                                            {member.role.replace("_", " ")}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground truncate">
                                            {member.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMembers.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                        No members match your search.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}