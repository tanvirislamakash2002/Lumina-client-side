import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { Roles } from "@/constants/roles";
import { DashboardClient } from "@/components/modules/dashboard/dashboard/DashboardClient";
import { getDashboard } from "@/actions/dashboard.action";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    if (userRole === Roles.ADMIN) {
        redirect("/admin");
    }

    const dashboardData = await getDashboard();

    return (
        <DashboardClient 
            initialData={dashboardData.success ? dashboardData.data : null}
            userRole={userRole}
        />
    );
}