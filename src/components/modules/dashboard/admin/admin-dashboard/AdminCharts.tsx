"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

interface AdminChartsProps {
    statsData: any;
    dateRange: string;
    onDateRangeChange: (value: string) => void;
}

const COLORS = {
    ADMIN: "#8b5cf6",
    PROJECT_MANAGER: "#6366f1",
    TEAM_MEMBER: "#10b981",
    ACTIVE: "#10b981",
    COMPLETED: "#3b82f6",
    ON_HOLD: "#f59e0b",
    HIGH: "#ef4444",
    MEDIUM: "#f59e0b",
    LOW: "#10b981",
};

// Custom label renderer with safety check
const renderCustomLabel = ({ name, percent }: { name?: string; percent?: number }) => {
    if (!percent || percent === 0) return "";
    return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export function AdminCharts({ statsData, dateRange, onDateRangeChange }: AdminChartsProps) {
    const dailyActiveUsers = statsData?.dailyActiveUsers || [];

    // Sample data - replace with actual data from your backend
    const tasksByPriority = [
        { name: "High", value: 45, color: COLORS.HIGH },
        { name: "Medium", value: 78, color: COLORS.MEDIUM },
        { name: "Low", value: 120, color: COLORS.LOW },
    ];

    const projectsByStatus = [
        { name: "Active", value: 32, color: COLORS.ACTIVE },
        { name: "Completed", value: 18, color: COLORS.COMPLETED },
        { name: "On Hold", value: 8, color: COLORS.ON_HOLD },
    ];

    const userRoleData = [
        { name: "Admin", value: statsData?.adminCount || 0, color: COLORS.ADMIN },
        { name: "Project Manager", value: statsData?.projectManagerCount || 0, color: COLORS.PROJECT_MANAGER },
        { name: "Team Member", value: statsData?.teamMemberCount || 0, color: COLORS.TEAM_MEMBER },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Active Users */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Daily Active Users</CardTitle>
                    <Select value={dateRange} onValueChange={onDateRangeChange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
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

            {/* Tasks by Priority */}
            <Card>
                <CardHeader>
                    <CardTitle>Tasks by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={tasksByPriority}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {tasksByPriority.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Projects by Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Projects by Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={projectsByStatus}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="Projects">
                                {projectsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
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
                </CardContent>
            </Card>
        </div>
    );
}