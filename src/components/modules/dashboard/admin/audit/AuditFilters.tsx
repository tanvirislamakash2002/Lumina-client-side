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

interface AuditFiltersProps {
    userId: string;
    action: string;
    days: string;
    search: string;
    users: any[];
    onUserChange: (value: string) => void;
    onActionChange: (value: string) => void;
    onDaysChange: (value: string) => void;
    onSearchChange: (value: string) => void;
    onClearFilters: () => void;
}

const actionOptions = [
    { value: "all", label: "All Actions" },
    { value: "PROJECT_CREATED", label: "Project Created" },
    { value: "PROJECT_UPDATED", label: "Project Updated" },
    { value: "PROJECT_DELETED", label: "Project Deleted" },
    { value: "TASK_CREATED", label: "Task Created" },
    { value: "TASK_UPDATED", label: "Task Updated" },
    { value: "TASK_DELETED", label: "Task Deleted" },
    { value: "TASK_ASSIGNED", label: "Task Assigned" },
    { value: "TASK_STATUS_CHANGED", label: "Status Changed" },
    { value: "MEMBER_ADDED", label: "Member Added" },
    { value: "MEMBER_REMOVED", label: "Member Removed" },
    { value: "COMMENT_ADDED", label: "Comment Added" },
    { value: "COMMENT_DELETED", label: "Comment Deleted" },
    { value: "USER_REGISTER", label: "User Registered" },
    { value: "ADMIN_ACTION", label: "Admin Action" },
];

const daysOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "365", label: "Last year" },
];

export function AuditFilters({
    userId,
    action,
    days,
    search,
    users,
    onUserChange,
    onActionChange,
    onDaysChange,
    onSearchChange,
    onClearFilters,
}: AuditFiltersProps) {
    const hasActiveFilters = userId !== "all" || action !== "all" || days !== "30" || search;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-wrap gap-3">
                    <Select value={userId} onValueChange={onUserChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by User" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={action} onValueChange={onActionChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Action" />
                        </SelectTrigger>
                        <SelectContent>
                            {actionOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={days} onValueChange={onDaysChange}>
                        <SelectTrigger className="w-[130px]">
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
                            placeholder="Search by message..."
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