"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X, Trash2 } from "lucide-react";

interface ManagerProjectsFilterBarProps {
    onSearch: (search: string, status: string, sortBy: string) => void;
    currentSearch: string;
    currentStatus: string;
    currentSortBy: string;
    selectedCount: number;
    onBulkDelete: () => void;
}

export function ManagerProjectsFilterBar({
    onSearch,
    currentSearch,
    currentStatus,
    currentSortBy,
    selectedCount,
    onBulkDelete,
}: ManagerProjectsFilterBarProps) {
    const [search, setSearch] = useState(currentSearch);
    const [status, setStatus] = useState(currentStatus);
    const [sortBy, setSortBy] = useState(currentSortBy);
    const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Trigger search when debounced value changes
    useEffect(() => {
        onSearch(debouncedSearch, status, sortBy);
    }, [debouncedSearch, status, sortBy, onSearch]);

    const handleClearFilters = () => {
        setSearch("");
        setStatus("all");
        setSortBy("latest");
    };

    const hasActiveFilters = search !== "" || status !== "all" || sortBy !== "latest";

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="ON_HOLD">On Hold</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Latest Created</SelectItem>
                            <SelectItem value="oldest">Oldest Created</SelectItem>
                            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                            <SelectItem value="deadline_asc">Nearest Deadline</SelectItem>
                            <SelectItem value="deadline_desc">Farthest Deadline</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    )}

                    {selectedCount > 0 && (
                        <Button
                            variant="destructive"
                            onClick={onBulkDelete}
                            className="gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete ({selectedCount})
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}