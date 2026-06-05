"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface UserAnalyticsProps {
    activityStats: any;
    userStats: any;
}

const COLORS = {
    ADMIN: "#8b5cf6",
    PROJECT_MANAGER: "#6366f1",
    TEAM_MEMBER: "#10b981",
};

const renderCustomLabel = ({ name, percent }: { name?: string; percent?: number }) => {
    if (!percent || percent === 0) return "";
    return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export function UserAnalytics({ activityStats, userStats }: UserAnalyticsProps) {
    const dailyActiveUsers = activityStats?.dailyActivities || [];
    const uniqueUsersCount = activityStats?.uniqueUsersCount || 0;

    const userRoleData = [
        { name: "Admin", value: userStats?.adminCount || 0, color: COLORS.ADMIN },
        { name: "Project Manager", value: userStats?.projectManagerCount || 0, color: COLORS.PROJECT_MANAGER },
        { name: "Team Member", value: userStats?.teamMemberCount || 0, color: COLORS.TEAM_MEMBER },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Active Users */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {dailyActiveUsers.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailyActiveUsers}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    name="Active Users"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* User Role Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>User Role Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={userRoleData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {userRoleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Unique active users in period: {uniqueUsersCount}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}