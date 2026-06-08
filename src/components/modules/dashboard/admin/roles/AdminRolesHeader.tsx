"use client";

import { Button } from "@/components/ui/button";
import { Shield, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AdminRolesHeaderProps {
    onRefresh: () => void;
}

export function AdminRolesHeader({ onRefresh }: AdminRolesHeaderProps) {
    const handleExport = () => {
        toast.success("Export started. Download will begin shortly.");
        // Export logic would go here
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Shield className="h-8 w-8 text-indigo-600" />
                    Role Management
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage user roles and permissions across the platform.
                </p>
            </div>
            <div className="flex gap-2">
                {/* <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button> */}
                <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>
        </div>
    );
}