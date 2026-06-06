"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, AlertCircle } from "lucide-react";

interface PMTeamWorkloadProps {
    members: any[];
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function PMTeamWorkload({ members }: PMTeamWorkloadProps) {
    if (members.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Team Workload</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-6">
                        No team members assigned yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Workload</CardTitle>
                <Link href="/team" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View all
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-4">
                {members.map((member) => (
                    <div key={member.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.image || undefined} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                        {getInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {member.totalTasks} tasks assigned
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium">{member.completionRate}%</p>
                                <p className="text-xs text-muted-foreground">
                                    {member.completedTasks} / {member.totalTasks} done
                                </p>
                            </div>
                        </div>
                        <Progress value={member.completionRate} className="h-2" />
                        {member.overdueTasks > 0 && (
                            <div className="flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                <span>{member.overdueTasks} overdue tasks</span>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}