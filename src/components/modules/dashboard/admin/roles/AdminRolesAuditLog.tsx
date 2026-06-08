"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp, History, Download } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { AdminRolesPagination } from "./AdminRolesPagination";
import { toast } from "sonner";

interface AdminRolesAuditLogProps {
    auditLog: any[];
    pagination: any;
    currentPage: number;
    onPageChange: (page: number) => void;
    isVisible: boolean;
    onToggleVisibility: () => void;
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function AdminRolesAuditLog({
    auditLog,
    pagination,
    currentPage,
    onPageChange,
    isVisible,
    onToggleVisibility,
}: AdminRolesAuditLogProps) {
    const handleExportAudit = () => {
        toast.success("Exporting audit log...");
    };

    // Filter only role change activities (ADMIN_ACTION with role change message)
    const roleChangeLogs = auditLog.filter(log => 
        log.action === "ADMIN_ACTION" && 
        log.message?.includes("role changed")
    );

    if (roleChangeLogs.length === 0 && !isVisible) {
        return null;
    }

    // Extract the new role from message: "User email@example.com role changed to PROJECT_MANAGER"
    const extractNewRole = (message: string) => {
        const match = message.match(/role changed to (\w+)/);
        return match ? match[1] : "Unknown";
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Role Change History</CardTitle>
                </div>
                <div className="flex gap-2">
                    {/* <Button variant="outline" size="sm" onClick={handleExportAudit}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button> */}
                    <Button variant="ghost" size="sm" onClick={onToggleVisibility}>
                        {isVisible ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>
            {isVisible && (
                <CardContent className="space-y-4">
                    {roleChangeLogs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No role change history found.
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {roleChangeLogs.map((log) => {
                                    const newRole = extractNewRole(log.message);
                                    return (
                                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={log.user?.image || undefined} />
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                                    {getInitials(log.user?.name || "U")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Link
                                                        href={`/dashboard/admin/users/${log.user?.id}`}
                                                        className="text-sm font-medium hover:text-indigo-600 transition-colors"
                                                    >
                                                        {log.user?.name}
                                                    </Link>
                                                    <span className="text-sm text-muted-foreground">
                                                        was granted
                                                    </span>
                                                    <Badge className="bg-indigo-100 text-indigo-700">
                                                        {newRole === "PROJECT_MANAGER" 
                                                            ? "Project Manager" 
                                                            : newRole === "TEAM_MEMBER" 
                                                                ? "Team Member" 
                                                                : newRole}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        role
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(log.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        By: {log.user?.name || "System"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {pagination && pagination.totalPages > 1 && (
                                <AdminRolesPagination
                                    currentPage={currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={onPageChange}
                                />
                            )}
                        </>
                    )}
                </CardContent>
            )}
        </Card>
    );
}