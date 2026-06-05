"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface ProjectAnalyticsProps {
    projectStats: any;
}

const COLORS = {
    ACTIVE: "#10b981",
    COMPLETED: "#3b82f6",
    ON_HOLD: "#f59e0b",
};

const renderCustomLabel = ({ name, percent }: { name?: string; percent?: number }) => {
    if (!percent || percent === 0) return "";
    return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export function ProjectAnalytics({ projectStats }: ProjectAnalyticsProps) {
    const projectStatusData = [
        { name: "Active", value: projectStats?.active || 0, color: COLORS.ACTIVE },
        { name: "Completed", value: projectStats?.completed || 0, color: COLORS.COMPLETED },
        { name: "On Hold", value: projectStats?.onHold || 0, color: COLORS.ON_HOLD },
    ];

    // Sample project creation trend - replace with actual data
    const projectCreationData = [
        { month: "Jan", count: 12 },
        { month: "Feb", count: 15 },
        { month: "Mar", count: 18 },
        { month: "Apr", count: 14 },
        { month: "May", count: 22 },
        { month: "Jun", count: 25 },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Projects by Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Projects by Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={projectStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {projectStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Project Creation Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Projects Created Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={projectCreationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#6366f1" name="Projects Created" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}