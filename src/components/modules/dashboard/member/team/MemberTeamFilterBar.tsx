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

interface MemberTeamFilterBarProps {
    onSearch: (search: string, role: string) => void;
    currentSearch: string;
    currentRole: string;
}

export function MemberTeamFilterBar({
    onSearch,
    currentSearch,
    currentRole,
}: MemberTeamFilterBarProps) {
    const [search, setSearch] = useState(currentSearch);
    const [role, setRole] = useState(currentRole);
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
        const roleChanged = role !== currentRole;

        if (searchChanged || roleChanged) {
            onSearch(debouncedSearch, role);
        }
    }, [debouncedSearch, role]);

    const handleClearFilters = () => {
        setSearch("");
        setRole("all");
        onSearch("", "all");
    };

    const hasActiveFilters = search !== "" || role !== "all";

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                            <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
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
                </div>
            </CardContent>
        </Card>
    );
}