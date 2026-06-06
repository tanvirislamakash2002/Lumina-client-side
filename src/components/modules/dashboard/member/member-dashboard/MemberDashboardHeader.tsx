"use client";

export function MemberDashboardHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back! Here's an overview of your tasks and projects.
                </p>
            </div>
        </div>
    );
}