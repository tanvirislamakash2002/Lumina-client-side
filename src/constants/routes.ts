import { Roles } from "./roles";

export type Role = typeof Roles[keyof typeof Roles];

export const routeConfig = {
    admin: {
        dashboard: "/admin",
        profile: "/admin/profile",
        users: "/admin/users",
        projects: "/admin/projects",
        settings: "/admin/settings",
        logs: "/admin/logs",
        audit: "/admin/audit",
    },
    projectManager: {
        dashboard: "/dashboard",
        profile: "/profile",
        projects: "/projects",
        createProject: "/projects/create",
        editProject: "/projects/edit",
        tasks: "/tasks",
        team: "/team",
        settings: "/settings",
    },
    teamMember: {
        dashboard: "/dashboard",
        profile: "/profile",
        projects: "/projects",
        tasks: "/tasks",
        team: "/team",
        settings: "/settings",
    },
    common: {
        login: "/login",
        register: "/register",
        logout: "/logout",
        forgotPassword: "/forgot-password",
        resetPassword: "/reset-password",
    },
};

export const getDashboardRoute = (role: string): string => {
    if (role === Roles.ADMIN) {
        return routeConfig.admin.dashboard;
    } else if (role === Roles.PROJECT_MANAGER) {
        return routeConfig.projectManager.dashboard;
    } else if (role === Roles.TEAM_MEMBER) {
        return routeConfig.teamMember.dashboard;
    }
    return "/";
};

export const getProfileRoute = (role: string): string => {
    if (role === Roles.ADMIN) {
        return routeConfig.admin.profile;
    } else if (role === Roles.PROJECT_MANAGER) {
        return routeConfig.projectManager.profile;
    } else if (role === Roles.TEAM_MEMBER) {
        return routeConfig.teamMember.profile;
    }
    return "/profile";
};

export const getSettingsRoute = (role: string): string => {
    if (role === Roles.ADMIN) {
        return routeConfig.admin.settings;
    } else if (role === Roles.PROJECT_MANAGER) {
        return routeConfig.projectManager.settings;
    } else if (role === Roles.TEAM_MEMBER) {
        return routeConfig.teamMember.settings;
    }
    return "/settings";
};

export const isActiveRoute = (pathname: string, routeUrl: string): boolean => {
    if (routeUrl === "/") return pathname === routeUrl;

    // Get the base path (e.g., "/admin" from "/admin/users")
    const segments = pathname.split('/').filter(Boolean);
    const basePath = segments.length >= 2 
        ? `/${segments[0]}/${segments[1]}`
        : `/${segments[0] || ''}`;
    
    // Handle dashboard base paths
    if (routeUrl === "/admin" && basePath === "/admin") {
        return pathname === routeUrl || pathname.startsWith(routeUrl + "/");
    }
    if (routeUrl === "/dashboard" && basePath === "/dashboard") {
        return pathname === routeUrl || pathname.startsWith(routeUrl + "/");
    }
    if (routeUrl === "/projects" && basePath === "/projects") {
        return pathname === routeUrl || pathname.startsWith(routeUrl + "/");
    }
    if (routeUrl === "/tasks" && basePath === "/tasks") {
        return pathname === routeUrl || pathname.startsWith(routeUrl + "/");
    }
    if (routeUrl === "/team" && basePath === "/team") {
        return pathname === routeUrl || pathname.startsWith(routeUrl + "/");
    }
    if (routeUrl === "/settings" && basePath === "/settings") {
        return pathname === routeUrl || pathname.startsWith(routeUrl + "/");
    }
    if (routeUrl === "/profile" && basePath === "/profile") {
        return pathname === routeUrl;
    }

    if (routeUrl === basePath) {
        return pathname === routeUrl;
    }

    return pathname.startsWith(routeUrl);
};

// Helper to check if a route is accessible by a role
export const isRouteAccessible = (pathname: string, userRole: string): boolean => {
    // Common routes accessible by all authenticated users
    const commonAuthRoutes = ["/dashboard", "/profile", "/settings", "/projects", "/tasks", "/team"];
    
    if (commonAuthRoutes.some(route => pathname.startsWith(route))) {
        return true;
    }
    
    // Admin only routes
    if (pathname.startsWith("/admin")) {
        return userRole === Roles.ADMIN;
    }
    
    // Public routes
    const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
    if (publicRoutes.includes(pathname)) {
        return true;
    }
    
    return false;
};

// Helper to get role-based redirect URL
export const getRoleBasedRedirect = (role: string): string => {
    switch (role) {
        case Roles.ADMIN:
            return routeConfig.admin.dashboard;
        case Roles.PROJECT_MANAGER:
            return routeConfig.projectManager.dashboard;
        case Roles.TEAM_MEMBER:
            return routeConfig.teamMember.dashboard;
        default:
            return "/login";
    }
};