"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
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
    LineChart,
    Line,
} from "recharts";

interface ChartsSectionProps {
    data: {
        tasksByPriority?: Array<{ priority: string; count: number }>;
        tasksByStatus?: Array<{ status: string; count: number }>;
        tasksOverTime?: Array<{ date: string; count: number }>;
        projectProgress?: Array<{ name: string; progress: number }>;
    } | null;
}

const COLORS = {
    HIGH: "#ef4444",
    MEDIUM: "#f59e0b",
    LOW: "#10b981",
    TODO: "#6b7280",
    IN_PROGRESS: "#3b82f6",
    COMPLETED: "#10b981",
};

const PRIORITY_LABELS = {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
};

const STATUS_LABELS = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
};

// Custom label renderer with safety check
const renderCustomLabel = ({ name, percent }: { name?: string; percent?: number }) => {
    if (!percent || percent === 0) return "";
    return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export function ChartsSection({ data }: ChartsSectionProps) {
    const tasksByPriority = data?.tasksByPriority || [];
    const tasksByStatus = data?.tasksByStatus || [];
    const tasksOverTime = data?.tasksOverTime || [];
    const projectProgress = data?.projectProgress || [];

    const priorityChartData = tasksByPriority.map((item) => ({
        name: PRIORITY_LABELS[item.priority as keyof typeof PRIORITY_LABELS] || item.priority,
        value: item.count,
        color: COLORS[item.priority as keyof typeof COLORS],
    }));

    const statusChartData = tasksByStatus.map((item) => ({
        name: STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || item.status,
        value: item.count,
        color: COLORS[item.status as keyof typeof COLORS],
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Tasks by Priority - Pie Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Tasks by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                    {priorityChartData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No task data available
                        </div>
                    ) : (
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
                                    {priorityChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Tasks by Status - Pie Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Tasks by Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {statusChartData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No task data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Tasks Completed Over Time - Line Chart */}
            {tasksOverTime.length > 0 && (
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Tasks Completed Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={tasksOverTime}>
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
                                    name="Tasks Completed"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Project Progress - Bar Chart */}
            {projectProgress.length > 0 && (
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Project Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={projectProgress}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="progress" fill="#6366f1" name="Completion %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}