"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

interface UserAnalyticsProps {
    systemStats: any;
    compact?: boolean;
    full?: boolean;
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export function UserAnalytics({ systemStats, compact, full }: UserAnalyticsProps) {
    if (!systemStats) return null;

    const dailyActiveData = systemStats.dailyActiveUsers?.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString(),
        users: Number(item.count),
    })) || [];

    // Mock role distribution data (would come from API)
    const roleDistribution = [
        { name: "Team Members", value: 65, color: COLORS[0] },
        { name: "Project Managers", value: 25, color: COLORS[1] },
        { name: "Admins", value: 10, color: COLORS[2] },
    ];

    // Mock user activity by hour
    const activityByHour = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        activities: Math.floor(Math.random() * 100) + 20,
    }));

    return (
        <div className="space-y-6">
            {/* User Growth Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Active Users (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={compact ? 250 : 400}>
                        <LineChart data={dailyActiveData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#6366f1" name="Active Users" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {!compact && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Role Distribution */}
                    {/* Role Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Users by Role</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={roleDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => {
                                            const percentage = percent ? (percent * 100).toFixed(0) : "0";
                                            return `${name}: ${percentage}%`;
                                        }}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {roleDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Activity by Hour */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity by Hour of Day</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={activityByHour}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="activities" fill="#6366f1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}