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

interface TeamFilterBarProps {
    onSearch: (search: string, projectId: string, sort: string) => void;
    projects: { id: string; name: string }[];
    currentSearch: string;
    currentProjectId: string;
    currentSort: string;
}

export function TeamFilterBar({
    onSearch,
    projects,
    currentSearch,
    currentProjectId,
    currentSort,
}: TeamFilterBarProps) {
    const [search, setSearch] = useState(currentSearch);
    const [projectId, setProjectId] = useState(currentProjectId);
    const [sort, setSort] = useState(currentSort);
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
        const projectChanged = projectId !== currentProjectId;
        const sortChanged = sort !== currentSort;

        if (searchChanged || projectChanged || sortChanged) {
            onSearch(debouncedSearch, projectId, sort);
        }
    }, [debouncedSearch, projectId, sort]);

    const handleClearFilters = () => {
        setSearch("");
        setProjectId("all");
        setSort("name_asc");
        onSearch("", "all", "name_asc");
    };

    const hasActiveFilters = search !== "" || projectId !== "all" || sort !== "name_asc";

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select value={projectId} onValueChange={setProjectId}>
                        <SelectTrigger className="w-full sm:w-56">
                            <SelectValue placeholder="Filter by Project" />
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

                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="tasks_high">Most Tasks</SelectItem>
                            <SelectItem value="tasks_low">Least Tasks</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}