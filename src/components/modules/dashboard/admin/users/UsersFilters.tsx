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
import { Card, CardContent } from "@/components/ui/card";

interface UsersFiltersProps {
    search: string;
    role: string;
    status: string;
    verified: string;
    sort: string;
    onSearchChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onVerifiedChange: (value: string) => void;
    onSortChange: (value: string) => void;
}

export function UsersFilters({
    search,
    role,
    status,
    verified,
    sort,
    onSearchChange,
    onRoleChange,
    onStatusChange,
    onVerifiedChange,
    onSortChange,
}: UsersFiltersProps) {
    const roleOptions = [
        { value: "all", label: "All Roles" },
        { value: "ADMIN", label: "Admin" },
        { value: "PROJECT_MANAGER", label: "Project Manager" },
        { value: "TEAM_MEMBER", label: "Team Member" },
    ];

    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "ACTIVE", label: "Active" },
        { value: "SUSPENDED", label: "Suspended" },
    ];

    const verifiedOptions = [
        { value: "all", label: "All" },
        { value: "verified", label: "Verified" },
        { value: "unverified", label: "Unverified" },
    ];

    const sortOptions = [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "name_asc", label: "Name (A-Z)" },
        { value: "name_desc", label: "Name (Z-A)" },
    ];

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select value={role} onValueChange={onRoleChange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roleOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={verified} onValueChange={onVerifiedChange}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Verified" />
                        </SelectTrigger>
                        <SelectContent>
                            {verifiedOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={onSortChange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}