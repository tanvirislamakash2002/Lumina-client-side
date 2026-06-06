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

    // Auth required for dashboard routes
    if (pathName.startsWith("/dashboard")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Admin only routes (under /dashboard/admin)
    if (pathName.startsWith("/dashboard/admin") && isAuthenticated && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Project Manager only routes (create/edit)
    if (
        (pathName.startsWith("/dashboard/projects/create") ||
         pathName.startsWith("/dashboard/tasks/create") ||
         pathName.match(/\/dashboard\/projects\/[^/]+\/edit/) ||
         pathName.match(/\/dashboard\/tasks\/[^/]+\/edit/)) &&
        isAuthenticated &&
        userRole !== "ADMIN" &&
        userRole !== "PROJECT_MANAGER"
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect to dashboard if already logged in and trying to access auth pages
    if ((pathName === "/login" || pathName === "/register") && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register",
    ],
};