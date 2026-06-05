"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FolderKanban, Settings, Trash2, FileText, Activity, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { clearCache } from "@/actions/admin.action";

interface Action {
    title: string;
    description: string;
    icon: any;
    href: string;
    color: string;
    bgColor: string;
}

const actions: Action[] = [
    {
        title: "Manage Users",
        description: "View, edit, and manage user accounts",
        icon: Users,
        href: "/admin/users",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    },
    {
        title: "Manage Projects",
        description: "View and manage all projects",
        icon: FolderKanban,
        href: "/admin/projects",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
        title: "System Settings",
        description: "Configure system preferences",
        icon: Settings,
        href: "/settings/system",
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
        title: "Audit Trail",
        description: "View system audit logs",
        icon: FileText,
        href: "/admin/audit",
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
        title: "System Logs",
        description: "View error and system logs",
        icon: Activity,
        href: "/admin/logs",
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
];

export function QuickActions() {
    const handleClearCache = async () => {
        const toastId = toast.loading("Clearing cache...");
        const result = await clearCache();
        if (result.success) {
            toast.success("Cache cleared successfully", { id: toastId });
        } else {
            toast.error(result.message || "Failed to clear cache", { id: toastId });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-3">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Button
                                key={action.title}
                                asChild
                                variant="outline"
                                className="justify-start h-auto py-3 px-4"
                            >
                                <Link href={action.href}>
                                    <div className={`p-2 rounded-lg ${action.bgColor} mr-3`}>
                                        <Icon className={`h-4 w-4 ${action.color}`} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium">{action.title}</p>
                                        <p className="text-xs text-muted-foreground">{action.description}</p>
                                    </div>
                                </Link>
                            </Button>
                        );
                    })}
                </div>
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleClearCache}
                >
                    <div className="p-2 rounded-lg bg-muted mr-3">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                        <p className="font-medium">Clear Cache</p>
                        <p className="text-xs text-muted-foreground">Clear application cache</p>
                    </div>
                </Button>
            </CardContent>
        </Card>
    );
}