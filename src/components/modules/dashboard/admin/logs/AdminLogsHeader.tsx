"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollText, Download, RefreshCw, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface AdminLogsHeaderProps {
    onRefresh: () => void;
}

export function AdminLogsHeader({ onRefresh }: AdminLogsHeaderProps) {
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        onRefresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleExport = () => {
        toast.success("Export started. Download will begin shortly.");
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <ScrollText className="h-8 w-8 text-indigo-600" />
                    System Logs
                </h1>
                <p className="text-muted-foreground mt-1">
                    Monitor system activities, errors, and user actions.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 mr-2">
                    <Switch
                        id="auto-refresh"
                        checked={autoRefresh}
                        onCheckedChange={setAutoRefresh}
                    />
                    <Label htmlFor="auto-refresh" className="text-sm">
                        {autoRefresh ? <Play className="h-3 w-3 inline mr-1" /> : <Pause className="h-3 w-3 inline mr-1" />}
                        Auto-refresh
                    </Label>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>
        </div>
    );
}