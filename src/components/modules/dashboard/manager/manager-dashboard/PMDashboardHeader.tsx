"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";

export function PMDashboardHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back! Here's an overview of your projects and team.
                </p>
            </div>
            <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href="/projects/create">
                        <FolderPlus className="h-4 w-4" />
                        New Project
                    </Link>
                </Button>
                <Button asChild variant="default" size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/tasks/create">
                        <Plus className="h-4 w-4" />
                        Create Task
                    </Link>
                </Button>
            </div>
        </div>
    );
}