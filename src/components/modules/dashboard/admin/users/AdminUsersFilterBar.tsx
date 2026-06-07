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

interface AdminUsersFilterBarProps {
    onSearch: (
        search: string,
        role: string,
        status: string,
        verified: string,
        sort: string
    ) => void;
    currentSearch: string;
    currentRole: string;
    currentStatus: string;
    currentVerified: string;
    currentSort: string;
}

export function AdminUsersFilterBar({
    onSearch,
    currentSearch,
    currentRole,
    currentStatus,
    currentVerified,
    currentSort,
}: AdminUsersFilterBarProps) {
    const [search, setSearch] = useState(currentSearch);
    const [role, setRole] = useState(currentRole);
    const [status, setStatus] = useState(currentStatus);
    const [verified, setVerified] = useState(currentVerified);
    const [sort, setSort] = useState(currentSort);
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
        const statusChanged = status !== currentStatus;
        const verifiedChanged = verified !== currentVerified;
        const sortChanged = sort !== currentSort;

        if (searchChanged || roleChanged || statusChanged || verifiedChanged || sortChanged) {
            onSearch(debouncedSearch, role, status, verified, sort);
        }
    }, [debouncedSearch, role, status, verified, sort]);

    const handleClearFilters = () => {
        setSearch("");
        setRole("all");
        setStatus("all");
        setVerified("all");
        setSort("newest");
        onSearch("", "all", "all", "all", "newest");
    };

    const hasActiveFilters = search !== "" ||
        role !== "all" ||
        status !== "all" ||
        verified !== "all" ||
        sort !== "newest";

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-3">
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

                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Select value={verified} onValueChange={setVerified}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Verification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
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
                </div>
            </CardContent>
        </Card>
    );
}