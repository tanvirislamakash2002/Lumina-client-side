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

interface AdminAuditFilterBarProps {
    onSearch: (search: string, action: string, userId: string, status: string) => void;
    currentSearch: string;
    currentAction: string;
    currentUserId: string;
    currentStatus: string;
}

const actionTypes = [
    { value: "all", label: "All Actions" },
    { value: "ROLE_CHANGE", label: "Role Change" },
    { value: "USER_CREATED", label: "User Created" },
    { value: "USER_UPDATED", label: "User Updated" },
    { value: "USER_DELETED", label: "User Deleted" },
    { value: "USER_SUSPENDED", label: "User Suspended" },
    { value: "USER_ACTIVATED", label: "User Activated" },
    { value: "PROJECT_DELETED", label: "Project Deleted" },
    { value: "TASK_DELETED", label: "Task Deleted" },
    { value: "LOGIN_SUCCESS", label: "Login Success" },
    { value: "LOGIN_FAILED", label: "Login Failed" },
    { value: "ADMIN_ACTION", label: "Admin Action" },
];

export function AdminAuditFilterBar({
    onSearch,
    currentSearch,
    currentAction,
    currentUserId,
    currentStatus,
}: AdminAuditFilterBarProps) {
    const [search, setSearch] = useState(currentSearch);
    const [action, setAction] = useState(currentAction);
    const [userId, setUserId] = useState(currentUserId);
    const [status, setStatus] = useState(currentStatus);
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
        const actionChanged = action !== currentAction;
        const userIdChanged = userId !== currentUserId;
        const statusChanged = status !== currentStatus;

        if (searchChanged || actionChanged || userIdChanged || statusChanged) {
            onSearch(debouncedSearch, action, userId, status);
        }
    }, [debouncedSearch, action, userId, status]);

    const handleClearFilters = () => {
        setSearch("");
        setAction("all");
        setUserId("");
        setStatus("all");
        onSearch("", "all", "", "all");
    };

    const hasActiveFilters = search !== "" || action !== "all" || userId !== "" || status !== "all";

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by user, email, or target..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Select value={action} onValueChange={setAction}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Action Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {actionTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full sm:w-36">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="SUCCESS">Success</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {hasActiveFilters && (
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={handleClearFilters}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}