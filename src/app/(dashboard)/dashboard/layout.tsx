import { AppSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import { getSession } from "@/actions/auth.action";

export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
    admin: React.ReactNode;
    manager: React.ReactNode;
    member: React.ReactNode;
}

export default async function DashboardLayout({
    admin,
    manager,
    member,
}: DashboardLayoutProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login?redirect=/dashboard");
    }

    const user = session.user;
    const userRole = user.role;

    // All authenticated users can access dashboard
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
                        {userRole === "ADMIN" && admin}
                        {userRole === "PROJECT_MANAGER" && manager}
                        {userRole === "TEAM_MEMBER" && member}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}