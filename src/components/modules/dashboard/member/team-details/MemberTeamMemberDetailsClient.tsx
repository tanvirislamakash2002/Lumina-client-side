"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Calendar, Users, FolderKanban } from "lucide-react";
import { format } from "date-fns";

interface MemberTeamMemberDetailsClientProps {
    user: any;
    sharedProjects: any[];
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const projectStatusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function MemberTeamMemberDetailsClient({
    user,
    sharedProjects,
}: MemberTeamMemberDetailsClientProps) {
    return (
        <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/team">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Team Member Profile</h1>
                    <p className="text-muted-foreground text-sm">
                        View information about {user.name}
                    </p>
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="flex justify-center">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.image || undefined} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 space-y-3">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                                    <Badge className={roleColors[user.role]}>
                                        {user.role === "ADMIN" 
                                            ? "Admin" 
                                            : user.role === "PROJECT_MANAGER" 
                                                ? "Project Manager" 
                                                : "Team Member"}
                                    </Badge>
                                    <Badge className={statusColors[user.accountStatus]}>
                                        {user.accountStatus}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Member since {format(new Date(user.createdAt), "MMMM dd, yyyy")}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shared Projects Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-indigo-600" />
                        Shared Projects
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sharedProjects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                            <p>No shared projects with {user.name}</p>
                            <p className="text-sm mt-1">
                                You don't have any projects in common with this team member.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sharedProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/dashboard/my-projects/${project.id}`}
                                    className="block"
                                >
                                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                                        <div>
                                            <p className="font-medium hover:text-indigo-600 transition-colors">
                                                {project.name}
                                            </p>
                                            {project.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>
                                        <Badge className={projectStatusColors[project.status]}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Note about collaboration */}
            <div className="text-center text-xs text-muted-foreground">
                <p>You can collaborate with {user.name} on shared projects.</p>
            </div>
        </div>
    );
}