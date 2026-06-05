import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./actions/auth.action";

export const proxy = async (request: NextRequest) => {
    const pathName = request.nextUrl.pathname;
    let isAuthenticated = false;
    let userRole = "";

    const { data } = await getSession();
    if (data?.user) {
        isAuthenticated = true;
        userRole = data.user.role;
    }

    // Auth required for these routes
    if (
        pathName.startsWith("/dashboard") ||
        pathName.startsWith("/projects") ||
        pathName.startsWith("/tasks") ||
        pathName.startsWith("/team") ||
        pathName.startsWith("/settings") ||
        pathName === "/profile"
    ) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Admin only routes
    if (
        (pathName.startsWith("/admin") || pathName === "/admin") &&
        userRole !== "ADMIN"
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Project Manager only routes (or admin)
    if (
        pathName.startsWith("/projects/create") &&
        userRole !== "ADMIN" &&
        userRole !== "PROJECT_MANAGER"
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect /dashboard based on role
    if (pathName === "/dashboard") {
        if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        // Project Managers and Team Members go to regular dashboard
        return NextResponse.next();
    }

    // Redirect to dashboard if already logged in and trying to access auth pages
    if ((pathName === "/login" || pathName === "/register") && isAuthenticated) {
        if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/projects/:path*",
        "/tasks/:path*",
        "/team/:path*",
        "/settings/:path*",
        "/profile",
        "/admin/:path*",
        "/login",
        "/register",
    ],
};