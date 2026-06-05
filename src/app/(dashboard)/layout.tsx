import { AppSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import { getSession } from "@/actions/auth.action";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login?redirect=/dashboard");
    }

    const user = session.user;

    // All authenticated users (Admin, Project Manager, Team Member) can access dashboard
    if (!user) {
        redirect("/");
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar user={user} />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <DashboardHeader user={user} />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}