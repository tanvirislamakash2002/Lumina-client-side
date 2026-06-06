"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ManagerProjectsHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground mt-1">
                    Manage all your projects, track progress, and monitor deadlines.
                </p>
            </div>
            <Button asChild className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Link href="/dashboard/projects/create">
                    <Plus className="h-4 w-4" />
                    New Project
                </Link>
            </Button>
        </div>
    );
}