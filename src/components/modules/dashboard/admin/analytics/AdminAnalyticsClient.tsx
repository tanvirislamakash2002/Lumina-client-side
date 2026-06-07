"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Download, RefreshCw } from "lucide-react";
import { KPICards } from "./KPICards";
import { UserAnalytics } from "./UserAnalytics";
import { TaskAnalytics } from "./TaskAnalytics";
import { ProjectAnalytics } from "./ProjectAnalytics";
import { TeamAnalytics } from "./TeamAnalytics";
import { ActivityAnalytics } from "./ActivityAnalytics";

interface AdminAnalyticsClientProps {
    platformStats: any;
    systemStats: any;
    activityStats: any;
    teamStats: any;
}

export function AdminAnalyticsClient({
    platformStats,
    systemStats,
    activityStats,
    teamStats,
}: AdminAnalyticsClientProps) {
    const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Refresh logic would go here
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleExport = () => {
        // Export logic would go here
        console.log("Export analytics data");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Platform insights, metrics, and performance tracking.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex border rounded-lg overflow-hidden">
                        <Button
                            variant={dateRange === "7d" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setDateRange("7d")}
                            className="rounded-none"
                        >
                            7d
                        </Button>
                        <Button
                            variant={dateRange === "30d" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setDateRange("30d")}
                            className="rounded-none"
                        >
                            30d
                        </Button>
                        <Button
                            variant={dateRange === "90d" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setDateRange("90d")}
                            className="rounded-none"
                        >
                            90d
                        </Button>
                        <Button
                            variant={dateRange === "1y" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setDateRange("1y")}
                            className="rounded-none"
                        >
                            1y
                        </Button>
                    </div>
                    {/* <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button> */}
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <KPICards platformStats={platformStats} systemStats={systemStats} />

            {/* Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-6 flex flex-col">
                <TabsList className="flex-wrap">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <>
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <UserAnalytics systemStats={systemStats} compact />
                            <TaskAnalytics platformStats={platformStats} compact />
                            <ProjectAnalytics platformStats={platformStats} compact />
                            <TeamAnalytics teamStats={teamStats} compact />
                        </div>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-6">
                        <UserAnalytics systemStats={systemStats} full />
                    </TabsContent>

                    <TabsContent value="tasks" className="space-y-6">
                        <TaskAnalytics platformStats={platformStats} full />
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-6">
                        <ProjectAnalytics platformStats={platformStats} full />
                    </TabsContent>

                    <TabsContent value="team" className="space-y-6">
                        <TeamAnalytics teamStats={teamStats} full />
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-6">
                        <ActivityAnalytics activityStats={activityStats} />
                    </TabsContent>
                </>
            </Tabs>
        </div>
    );
}