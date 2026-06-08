"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface AdminProjectAnalyticsTabProps {
    stats: any;
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export function AdminProjectAnalyticsTab({ stats }: AdminProjectAnalyticsTabProps) {
    if (!stats) return null;

    // Tasks by Status Data
    const tasksByStatus = [
        { name: "Completed", value: stats.completedTasks || 0, color: COLORS[1] },
        { name: "In Progress", value: stats.inProgressTasks || 0, color: COLORS[2] },
        { name: "To Do", value: (stats.totalTasks || 0) - (stats.completedTasks || 0) - (stats.inProgressTasks || 0), color: COLORS[0] },
        { name: "Overdue", value: stats.overdueTasks || 0, color: COLORS[3] },
    ];

    // Tasks by Priority Data
    const tasksByPriority = stats.tasksByPriority || [
        { priority: "High", count: Math.floor((stats.totalTasks || 0) * 0.2) },
        { priority: "Medium", count: Math.floor((stats.totalTasks || 0) * 0.5) },
        { priority: "Low", count: Math.floor((stats.totalTasks || 0) * 0.3) },
    ];

    // Member Workload Data
    const memberWorkload = stats.memberWorkload || [];

    return (
        <div className="space-y-6">
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
                                    data={tasksByStatus}
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
                                    {tasksByStatus.map((entry, index) => (
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
                            <BarChart data={tasksByPriority}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="priority" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Member Workload */}
            {memberWorkload.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Member Workload Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={memberWorkload} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={100} />
                                <Tooltip />
                                <Bar dataKey="totalTasks" fill="#6366f1" name="Total Tasks" />
                                <Bar dataKey="completedTasks" fill="#10b981" name="Completed Tasks" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}