"use client";

import { Button } from "@/components/ui/button";
import { FolderKanban, Download, RefreshCw } from "lucide-react";

interface AdminProjectsHeaderProps {
    onRefresh: () => void;
}

export function AdminProjectsHeader({ onRefresh }: AdminProjectsHeaderProps) {
    const handleExport = () => {
        // Export logic would go here
        console.log("Export projects");
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <FolderKanban className="h-8 w-8 text-indigo-600" />
                    All Projects
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage and monitor all projects across the platform.
                </p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
                <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>
        </div>
    );
}