"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

interface TeamAnalyticsProps {
    teamStats: any;
    compact?: boolean;
    full?: boolean;
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function TeamAnalytics({ teamStats, compact, full }: TeamAnalyticsProps) {
    if (!teamStats) return null;

    // Mock top performers data
    const topPerformers = [
        { name: "John Doe", tasksCompleted: 45, role: "Developer" },
        { name: "Jane Smith", tasksCompleted: 38, role: "Designer" },
        { name: "Mike Johnson", tasksCompleted: 32, role: "Developer" },
        { name: "Sarah Williams", tasksCompleted: 28, role: "Project Manager" },
        { name: "Tom Brown", tasksCompleted: 25, role: "Tester" },
    ];

    // Mock role distribution
    const roleDistribution = [
        { name: "Developers", value: 45, color: COLORS[0] },
        { name: "Designers", value: 20, color: COLORS[1] },
        { name: "Project Managers", value: 15, color: COLORS[2] },
        { name: "QA Testers", value: 12, color: COLORS[3] },
        { name: "Admins", value: 8, color: COLORS[4] },
    ];

    // Mock workload distribution
    const workloadDistribution = [
        { range: "0-10 tasks", count: 12 },
        { range: "11-20 tasks", count: 18 },
        { range: "21-30 tasks", count: 15 },
        { range: "31-40 tasks", count: 8 },
        { range: "41+ tasks", count: 5 },
    ];

    const overview = teamStats?.overview || {
        totalMembers: 58,
        activeMembers: 52,
        totalTasksAssigned: 350,
        completedTasks: 210,
        overallCompletionRate: 60,
    };

    return (
        <div className="space-y-6">
            {/* Team Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.totalMembers}</div>
                        <p className="text-xs text-muted-foreground">Active: {overview.activeMembers}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tasks Assigned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.totalTasksAssigned}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tasks Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.completedTasks}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.overallCompletionRate}%</div>
                    </CardContent>
                </Card>
            </div>

            {!compact && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Top Performers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topPerformers} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="tasksCompleted" fill="#6366f1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Role Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Composition</CardTitle>
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

                    {/* Workload Distribution */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Workload Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={workloadDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}