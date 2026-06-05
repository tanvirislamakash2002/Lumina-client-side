"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
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

interface TaskAnalyticsProps {
    completionStats: any;
}

const COLORS = {
    HIGH: "#ef4444",
    MEDIUM: "#f59e0b",
    LOW: "#10b981",
    TODO: "#6b7280",
    IN_PROGRESS: "#3b82f6",
    COMPLETED: "#10b981",
};

const renderCustomLabel = ({ name, percent }: { name?: string; percent?: number }) => {
    if (!percent || percent === 0) return "";
    return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export function TaskAnalytics({ completionStats }: TaskAnalyticsProps) {
    const tasksByPriority = completionStats?.completionByPriority || [
        { priority: "HIGH", total: 0, completed: 0, rate: 0 },
        { priority: "MEDIUM", total: 0, completed: 0, rate: 0 },
        { priority: "LOW", total: 0, completed: 0, rate: 0 },
    ];

    const priorityChartData = tasksByPriority.map((item: any) => ({
        name: item.priority,
        value: item.total,
        color: COLORS[item.priority as keyof typeof COLORS],
    }));

    const monthlyCompletion = completionStats?.monthlyCompletion || [];

    // Sample task completion trend - replace with actual data
    const taskCompletionData = [
        { month: "Jan", created: 45, completed: 38 },
        { month: "Feb", created: 52, completed: 42 },
        { month: "Mar", created: 48, completed: 44 },
        { month: "Apr", created: 60, completed: 52 },
        { month: "May", created: 55, completed: 50 },
        { month: "Jun", created: 68, completed: 62 },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Tasks by Priority */}
            <Card>
                <CardHeader>
                    <CardTitle>Tasks by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={priorityChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {priorityChartData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Average completion time: {completionStats?.avgCompletionDays || 0} days
                    </p>
                </CardContent>
            </Card>

            {/* Monthly Completion Rate */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    {monthlyCompletion.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyCompletion}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    name="Completion Rate %"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Tasks Created vs Completed */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Tasks Created vs Completed</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={taskCompletionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="created" fill="#6366f1" name="Tasks Created" />
                            <Bar dataKey="completed" fill="#10b981" name="Tasks Completed" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}