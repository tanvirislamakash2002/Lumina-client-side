"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

interface TaskAnalyticsProps {
    platformStats: any;
    compact?: boolean;
    full?: boolean;
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function TaskAnalytics({ platformStats, compact, full }: TaskAnalyticsProps) {
    if (!platformStats) return null;

    // Mock task status distribution
    const statusDistribution = [
        { name: "Completed", value: platformStats.completedTasks || 0, color: COLORS[1] },
        { name: "In Progress", value: Math.floor(platformStats.totalTasks * 0.3), color: COLORS[2] },
        { name: "To Do", value: Math.floor(platformStats.totalTasks * 0.4), color: COLORS[0] },
    ];

    // Mock priority distribution
    const priorityDistribution = [
        { name: "High", value: Math.floor(platformStats.totalTasks * 0.2), color: COLORS[3] },
        { name: "Medium", value: Math.floor(platformStats.totalTasks * 0.5), color: COLORS[2] },
        { name: "Low", value: Math.floor(platformStats.totalTasks * 0.3), color: COLORS[1] },
    ];

    // Mock tasks over time (last 30 days)
    const tasksOverTime = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(),
        created: Math.floor(Math.random() * 50) + 10,
        completed: Math.floor(Math.random() * 40) + 5,
    }));

    // Mock tasks by project (top 5)
    const tasksByProject = [
        { name: "Website Redesign", tasks: 45 },
        { name: "Mobile App", tasks: 38 },
        { name: "Backend API", tasks: 32 },
        { name: "Database Migration", tasks: 25 },
        { name: "UI/UX Design", tasks: 20 },
    ];

    return (
        <div className="space-y-6">
            {/* Tasks Created vs Completed */}
            <Card>
                <CardHeader>
                    <CardTitle>Tasks Created vs Completed (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={compact ? 250 : 400}>
                        <LineChart data={tasksOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="created" stroke="#6366f1" name="Tasks Created" />
                            <Line type="monotone" dataKey="completed" stroke="#10b981" name="Tasks Completed" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {!compact && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Tasks by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks by Status</CardTitle>
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

                    {/* Tasks by Priority */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks by Priority</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={priorityDistribution}
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
                                        {priorityDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Tasks by Project */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Top Projects by Task Count</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={tasksByProject} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="tasks" fill="#6366f1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}