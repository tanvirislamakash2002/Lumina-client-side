"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface ProjectAnalyticsProps {
    platformStats: any;
    compact?: boolean;
    full?: boolean;
}

const COLORS = ["#10b981", "#6366f1", "#f59e0b"];

export function ProjectAnalytics({ platformStats, compact, full }: ProjectAnalyticsProps) {
    if (!platformStats) return null;

    // Mock project status distribution
    const statusDistribution = [
        { name: "Active", value: platformStats.activeProjects || 0, color: COLORS[0] },
        { name: "Completed", value: platformStats.completedTasks ? Math.floor(platformStats.totalProjects * 0.3) : 0, color: COLORS[1] },
        { name: "On Hold", value: Math.floor(platformStats.totalProjects * 0.1), color: COLORS[2] },
    ];

    // Mock projects over time
    const projectsOverTime = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        created: Math.floor(Math.random() * 20) + 5,
    }));

    // Mock average project completion time
    const avgCompletionTime = [
        { project: "Website Redesign", days: 45 },
        { project: "Mobile App", days: 38 },
        { project: "Backend API", days: 32 },
        { project: "Database Migration", days: 28 },
        { project: "UI/UX Design", days: 25 },
    ];

    return (
        <div className="space-y-6">
            {/* Projects Created Over Time */}
            <Card>
                <CardHeader>
                    <CardTitle>Projects Created (Last 12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={compact ? 250 : 350}>
                        <LineChart data={projectsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="created" stroke="#6366f1" name="Projects Created" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {!compact && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Project Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Projects by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
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
                                        {statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Average Completion Time */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Average Project Completion Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={avgCompletionTime} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" label={{ value: 'Days', position: 'insideBottom' }} />
                                    <YAxis type="category" dataKey="project" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="days" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}