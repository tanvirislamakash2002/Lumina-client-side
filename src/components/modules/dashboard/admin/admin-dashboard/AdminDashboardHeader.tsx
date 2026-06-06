"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminDashboardHeader() {
    const router = useRouter();

    const handleRefresh = () => {
        toast.loading("Refreshing dashboard...");
        router.refresh();
        setTimeout(() => {
            toast.dismiss();
            toast.success("Dashboard refreshed");
        }, 1000);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    System overview and analytics at a glance
                </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
            </Button>
        </div>
    );
}