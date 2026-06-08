"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Calendar, Shield, UserCog } from "lucide-react";
import { format } from "date-fns";

interface AdminUserHeaderProps {
    user: any;
    isOwnProfile: boolean;
    onRefresh: () => void;
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

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function AdminUserHeader({ user, isOwnProfile, onRefresh }: AdminUserHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/admin/users">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
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
                        {isOwnProfile && (
                            <Badge variant="secondary">You</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Member since {format(new Date(user.createdAt), "MMMM dd, yyyy")}</span>
                    </div>
                </div>
            </div>
            {/* <div className="flex gap-2">
                <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Reset Password
                </Button>
                <Button variant="outline" size="sm">
                    <UserCog className="h-4 w-4 mr-2" />
                    Impersonate
                </Button>
            </div> */}
        </div>
    );
}