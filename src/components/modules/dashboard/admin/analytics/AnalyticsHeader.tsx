"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AnalyticsHeaderProps {
    days: number;
}

const dayOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "365", label: "Last 12 months" },
];

export function AnalyticsHeader({ days }: AnalyticsHeaderProps) {
    const router = useRouter();
    const [compare, setCompare] = useState(false);

    const handleDaysChange = (value: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set("days", value);
        url.searchParams.set("compare", compare.toString());
        router.push(url.pathname + url.search);
    };

    const handleCompareChange = (checked: boolean) => {
        setCompare(checked);
        const url = new URL(window.location.href);
        url.searchParams.set("days", days.toString());
        url.searchParams.set("compare", checked.toString());
        router.push(url.pathname + url.search);
    };

    const handleRefresh = () => {
        toast.loading("Refreshing data...");
        router.refresh();
        setTimeout(() => {
            toast.dismiss();
            toast.success("Data refreshed");
        }, 1000);
    };

    const handleExport = () => {
        toast.info("Export feature coming soon");
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">
                    Deep insights into platform performance and user behavior
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Select value={days.toString()} onValueChange={handleDaysChange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            {dayOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                        <Switch
                            id="compare"
                            checked={compare}
                            onCheckedChange={handleCompareChange}
                        />
                        <Label htmlFor="compare">Compare with previous period</Label>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>
        </div>
    );
}