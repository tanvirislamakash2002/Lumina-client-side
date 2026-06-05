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
import { Card, CardContent } from "@/components/ui/card";

interface TeamFiltersProps {
    search: string;
    selectedProjectId: string;
    projects: Array<{ id: string; name: string }>;
    onSearchChange: (value: string) => void;
    onProjectChange: (value: string) => void;
}

export function TeamFilters({
    search,
    selectedProjectId,
    projects,
    onSearchChange,
    onProjectChange,
}: TeamFiltersProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={selectedProjectId} onValueChange={onProjectChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}