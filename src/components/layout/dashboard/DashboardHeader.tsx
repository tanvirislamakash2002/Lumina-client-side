"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
    image?: string | null;
}

interface DashboardHeaderProps {
    user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const { toggleSidebar } = useSidebar();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const roleDisplay = user.role === "ADMIN" 
        ? "Admin" 
        : user.role === "PROJECT_MANAGER" 
            ? "Project Manager" 
            : "Team Member";

    return (
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Search - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects, tasks..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search - Mobile */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden"
                        onClick={() => router.push("/search")}
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                    <ThemeToggle />

                    {/* Notifications */}
                    {/* <Button 
                        variant="ghost" 
                        size="icon" 
                        className="relative"
                        onClick={() => router.push("/notifications")}
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    </Button> */}

                    <div className="flex items-center gap-3 pl-3 border-l">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {roleDisplay.toLowerCase()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}