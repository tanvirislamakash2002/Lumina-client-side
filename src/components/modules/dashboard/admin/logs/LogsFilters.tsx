"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LogsFiltersProps {
    level: string;
    days: string;
    search: string;
    onLevelChange: (value: string) => void;
    onDaysChange: (value: string) => void;
    onSearchChange: (value: string) => void;
    onClearFilters: () => void;
}

export function LogsFilters({
    level,
    days,
    search,
    onLevelChange,
    onDaysChange,
    onSearchChange,
    onClearFilters,
}: LogsFiltersProps) {
    const levelOptions = [
        { value: "all", label: "All Levels" },
        { value: "INFO", label: "Info" },
        { value: "WARN", label: "Warning" },
        { value: "ERROR", label: "Error" },
    ];

    const daysOptions = [
        { value: "1", label: "Last 24 hours" },
        { value: "7", label: "Last 7 days" },
        { value: "30", label: "Last 30 days" },
        { value: "90", label: "Last 90 days" },
    ];

    const hasActiveFilters = level !== "all" || days !== "7" || search;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-wrap gap-3">
                    <Select value={level} onValueChange={onLevelChange}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                            {levelOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={days} onValueChange={onDaysChange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            {daysOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search logs..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={onClearFilters}>
                            Clear Filters
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}