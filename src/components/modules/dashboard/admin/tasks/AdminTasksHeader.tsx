"use client";

import { Button } from "@/components/ui/button";
import { CheckSquare, Download, RefreshCw } from "lucide-react";

interface AdminTasksHeaderProps {
    onRefresh: () => void;
}

export function AdminTasksHeader({ onRefresh }: AdminTasksHeaderProps) {
    const handleExport = () => {
        console.log("Export tasks");
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <CheckSquare className="h-8 w-8 text-indigo-600" />
                    All Tasks
                </h1>
                <p className="text-muted-foreground mt-1">
                    Monitor all tasks across the platform.
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