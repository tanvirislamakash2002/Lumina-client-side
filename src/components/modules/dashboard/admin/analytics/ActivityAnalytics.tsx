"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface ActivityAnalyticsProps {
    activityStats: any;
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function ActivityAnalytics({ activityStats }: ActivityAnalyticsProps) {
    if (!activityStats) return null;

    // Mock daily activity data
    const dailyActivity = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(),
        activities: Math.floor(Math.random() * 200) + 50,
    }));

    // Mock action distribution
    const actionDistribution = [
        { name: "Task Created", value: 35, color: COLORS[0] },
        { name: "Task Completed", value: 28, color: COLORS[1] },
        { name: "Comment Added", value: 20, color: COLORS[2] },
        { name: "Status Changed", value: 12, color: COLORS[3] },
        { name: "Attachment Added", value: 5, color: COLORS[4] },
    ];

    // Mock activity by day of week
    const activityByDay = [
        { day: "Monday", activities: 320 },
        { day: "Tuesday", activities: 380 },
        { day: "Wednesday", activities: 350 },
        { day: "Thursday", activities: 310 },
        { day: "Friday", activities: 280 },
        { day: "Saturday", activities: 120 },
        { day: "Sunday", activities: 90 },
    ];

    return (
        <div className="space-y-6">
            {/* Daily Activity Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Activity Trend (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={dailyActivity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="activities" stroke="#6366f1" name="Activities" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Action Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={actionDistribution}
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
                                    {actionDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Activity by Day of Week */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activity by Day of Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={activityByDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="activities" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Stats Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {activityStats.totalActivities?.toLocaleString() || "0"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Unique Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {activityStats.uniqueUsersCount?.toLocaleString() || "0"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Most Active Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold truncate">
                            {activityStats.topProject || "N/A"}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}