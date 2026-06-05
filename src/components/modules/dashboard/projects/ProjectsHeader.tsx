"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsHeaderProps {
    canCreateProject: boolean;
}

export function ProjectsHeader({ canCreateProject }: ProjectsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground mt-1">
                    Manage and track all your projects in one place
                </p>
            </div>
            {canCreateProject && (
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/projects/create">
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                    </Link>
                </Button>
            )}
        </div>
    );
}