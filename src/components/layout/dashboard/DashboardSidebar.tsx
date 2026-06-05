"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    LogOut,
    ChevronRight,
    User,
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Bell,
    Settings,
    BarChart3,
    Activity,
    Shield,
    Bookmark,
    Clock,
    Tag,
    Mail,
    FileText,
    Home,
    UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Roles } from "@/constants/roles";
import { isActiveRoute } from "@/constants/routes";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
    image?: string | null;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: User;
}

// Common Routes (for both PM and Team Member)
const commonRoutes = [
    {
        title: "Overview",
        items: [
            { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        title: "Work",
        items: [
            { title: "Projects", url: "/projects", icon: FolderKanban },
            { title: "Tasks", url: "/tasks", icon: CheckSquare },
            { title: "My Tasks", url: "/my-tasks", icon: UserCheck },
            { title: "Team", url: "/team", icon: Users },
        ],
    },
    {
        title: "Activity",
        items: [
            { title: "Notifications", url: "/notifications", icon: Bell },
            // { title: "Activity Log", url: "/activities", icon: Activity },
        ],
    },
    {
        title: "Account",
        items: [
            { title: "Profile", url: "/profile", icon: User },
            { title: "Settings", url: "/settings/notifications", icon: Settings },
        ],
    },
];

// Admin Routes
const adminRoutes = [
    {
        title: "Overview",
        items: [
            { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
            { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
        ],
    },
    {
        title: "Management",
        items: [
            { title: "Users", url: "/admin/users", icon: Users },
            { title: "Projects", url: "/admin/projects", icon: FolderKanban },
            // { title: "Categories", url: "/admin/categories", icon: Tag },
        ],
    },
    {
        title: "System",
        items: [
            { title: "Activity Logs", url: "/admin/logs", icon: Activity },
            { title: "Audit Trail", url: "/admin/audit", icon: FileText },
            { title: "Settings", url: "/admin/settings", icon: Settings },
        ],
    },
];

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    // Select routes based on user role
    const routes = user.role === Roles.ADMIN ? adminRoutes : commonRoutes;

    const handleLogout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            await authClient.signOut();
            toast.success("Logged out successfully", { id: toastId });
            router.push("/login");
            router.refresh();
        } catch (error) {
            toast.error("Failed to logout", { id: toastId });
            console.error("Logout error:", error);
        }
    };

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const roleDisplay = user.role === "ADMIN"
        ? "Admin"
        : user.role === "PROJECT_MANAGER"
            ? "Project Manager"
            : "Team Member";

    return (
        <Sidebar
            collapsible="icon"
            className="border-r shrink-0 h-screen sticky top-0"
            {...props}
        >
            {/* Sidebar Header */}
            <SidebarHeader className="border-b px-4 py-4 h-16 flex-shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">L</span>
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent whitespace-nowrap">
                        Lumina
                    </span>
                    <span className="text-xs text-muted-foreground hidden group-data-[collapsible=icon]:hidden">
                        {roleDisplay}
                    </span>
                </Link>
            </SidebarHeader>

            {/* Sidebar Content */}
            <SidebarContent className="flex-1 overflow-y-auto">
                {routes.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider px-2">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActiveRoute(pathname, item.url);

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                                                <Link href={item.url} className="flex items-center gap-3">
                                                    {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                                                    <span className="truncate">{item.title}</span>
                                                    {active && (
                                                        <ChevronRight className="h-3 w-3 ml-auto flex-shrink-0" />
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter className="border-t p-4 flex-shrink-0">
                <div className="flex items-center gap-3 mb-3 min-w-0">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src={user.image || undefined} alt={user.name} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                        </p>
                        <p className="text-xs text-indigo-600 capitalize mt-0.5">
                            {roleDisplay.toLowerCase()}
                        </p>
                    </div>
                </div>
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden truncate">Logout</span>
                    </Button>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}