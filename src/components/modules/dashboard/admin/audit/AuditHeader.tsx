"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function AuditHeader() {
    const [isExporting, setIsExporting] = useState(false);

    const handleRefresh = () => {
        toast.loading("Refreshing audit trail...");
        window.location.reload();
        setTimeout(() => toast.dismiss(), 1000);
    };

    const handleExport = async () => {
        setIsExporting(true);
        toast.info("Export feature coming soon");
        // TODO: Implement export functionality
        setIsExporting(false);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
                <p className="text-muted-foreground mt-1">
                    Track all user actions and system events for compliance
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting} className="gap-2">
                    <Download className="h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>
        </div>
    );
}