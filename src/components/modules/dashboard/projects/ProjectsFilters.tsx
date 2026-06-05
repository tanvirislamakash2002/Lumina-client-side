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

interface ProjectsFiltersProps {
    search: string;
    status: string;
    sortBy: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSortChange: (value: string) => void;
    filters: any;
}

export function ProjectsFilters({
    search,
    status,
    sortBy,
    onSearchChange,
    onStatusChange,
    onSortChange,
    filters,
}: ProjectsFiltersProps) {
    const statusOptions = filters?.statuses || [
        { value: "all", label: "All Status" },
        { value: "ACTIVE", label: "Active" },
        { value: "COMPLETED", label: "Completed" },
        { value: "ON_HOLD", label: "On Hold" },
    ];

    const sortOptions = [
        { value: "latest", label: "Latest" },
        { value: "oldest", label: "Oldest" },
        { value: "name_asc", label: "Name (A-Z)" },
        { value: "deadline_asc", label: "Deadline (Earliest)" },
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>
            <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map((option: any) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}