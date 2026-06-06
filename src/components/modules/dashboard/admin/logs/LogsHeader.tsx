"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function LogsHeader() {
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

    const handleRefresh = () => {
        toast.loading("Refreshing logs...");
        window.location.reload();
        setTimeout(() => toast.dismiss(), 1000);
    };

    const handleAutoRefreshToggle = (checked: boolean) => {
        setAutoRefresh(checked);
        if (checked) {
            const interval = setInterval(() => {
                window.location.reload();
            }, 30000);
            setRefreshInterval(interval);
            toast.success("Auto-refresh enabled (30s interval)");
        } else {
            if (refreshInterval) {
                clearInterval(refreshInterval);
                setRefreshInterval(null);
                toast.success("Auto-refresh disabled");
            }
        }
    };

    const handleExport = () => {
        toast.info("Export feature coming soon");
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
                <p className="text-muted-foreground mt-1">
                    View and monitor system events and errors
                </p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Switch
                        id="auto-refresh"
                        checked={autoRefresh}
                        onCheckedChange={handleAutoRefreshToggle}
                    />
                    <Label htmlFor="auto-refresh" className="text-sm">
                        Auto-refresh
                    </Label>
                </div>
                {/* <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button> */}
                <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>
        </div>
    );
}