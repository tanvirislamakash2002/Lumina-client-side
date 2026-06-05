"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface MemberWorkloadProps {
    data: Array<{
        id: string;
        name: string;
        email: string;
        image: string | null;
        role: string;
        totalTasks: number;
        completedTasks: number;
        inProgressTasks: number;
        todoTasks: number;
        overdueTasks: number;
        completionRate: number;
    }> | null;
}

export function MemberWorkload({ data }: MemberWorkloadProps) {
    const members = data || [];

    if (members.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Team Workload</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-6">
                        No team members assigned yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Team Workload</CardTitle>
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
                            <p className="text-xs text-red-500">
                                {member.overdueTasks} overdue tasks
                            </p>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}