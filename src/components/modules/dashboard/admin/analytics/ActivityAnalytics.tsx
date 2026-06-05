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
} from "recharts";

interface ActivityAnalyticsProps {
    activityStats: any;
}

export function ActivityAnalytics({ activityStats }: ActivityAnalyticsProps) {
    const actionStats = activityStats?.actionStats || [];
    const topActions = actionStats.slice(0, 8);

    // Sample peak hours data - replace with actual data
    const peakHoursData = [
        { hour: "6AM", count: 45 },
        { hour: "9AM", count: 180 },
        { hour: "12PM", count: 220 },
        { hour: "3PM", count: 195 },
        { hour: "6PM", count: 150 },
        { hour: "9PM", count: 85 },
        { hour: "12AM", count: 25 },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Most Common Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Most Common Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    {topActions.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={topActions}
                                layout="vertical"
                                margin={{ left: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="action" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#6366f1" name="Action Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Peak Activity Hours */}
            <Card>
                <CardHeader>
                    <CardTitle>Peak Activity Hours</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={peakHoursData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#f59e0b" name="Activity Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}