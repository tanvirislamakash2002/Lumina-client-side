"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Download, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

interface AdminAuditHeaderProps {
    onRefresh: () => void;
}

export function AdminAuditHeader({ onRefresh }: AdminAuditHeaderProps) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        onRefresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleExport = () => {
        toast.success("Export started. Audit report will be downloaded shortly.");
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <FileText className="h-8 w-8 text-indigo-600" />
                    Audit Trail
                </h1>
                <p className="text-muted-foreground mt-1">
                    Track user actions and security events for compliance.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                                ) : (
                                    format(dateRange.from, "MMM dd")
                                )
                            ) : (
                                "Last 90 days"
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
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