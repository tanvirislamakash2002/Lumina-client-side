"use client";

import { useState, useEffect, useRef } from "react";
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
import { Search, X } from "lucide-react";

interface AdminLogsFilterBarProps {
    onSearch: (search: string, level: string) => void;
    currentSearch: string;
    currentLevel: string;
}

export function AdminLogsFilterBar({
    onSearch,
    currentSearch,
    currentLevel,
}: AdminLogsFilterBarProps) {
    const [search, setSearch] = useState(currentSearch);
    const [level, setLevel] = useState(currentLevel);
    const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);
    const initialRender = useRef(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const searchChanged = debouncedSearch !== currentSearch;
        const levelChanged = level !== currentLevel;

        if (searchChanged || levelChanged) {
            onSearch(debouncedSearch, level);
        }
    }, [debouncedSearch, level]);

    const handleClearFilters = () => {
        setSearch("");
        setLevel("all");
        onSearch("", "all");
    };

    const hasActiveFilters = search !== "" || level !== "all";

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by message, user, or IP..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger className="w-full sm:w-36">
                            <SelectValue placeholder="Log Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="ERROR">Error</SelectItem>
                            <SelectItem value="WARNING">Warning</SelectItem>
                            <SelectItem value="INFO">Info</SelectItem>
                            <SelectItem value="DEBUG">Debug</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}