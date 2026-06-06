"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ManagerTasksHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
                <p className="text-muted-foreground mt-1">
                    Manage and track all tasks across your projects.
                </p>
            </div>
            <Button asChild className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Link href="/dashboard/tasks/create">
                    <Plus className="h-4 w-4" />
                    Create Task
                </Link>
            </Button>
        </div>
    );
}