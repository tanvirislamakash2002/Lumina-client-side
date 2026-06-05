"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TasksHeaderProps {
    canCreate: boolean;
}

export function TasksHeader({ canCreate }: TasksHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                <p className="text-muted-foreground mt-1">
                    Manage and track all tasks across your projects
                </p>
            </div>
            {canCreate && (
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/tasks/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                    </Link>
                </Button>
            )}
        </div>
    );
}