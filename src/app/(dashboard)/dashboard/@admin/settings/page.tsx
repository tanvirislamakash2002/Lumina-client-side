import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getGeneralSettings, getSystemSettings, getSecuritySettings } from "@/actions/settings.action";
import { AdminSettingsClient } from "@/components/modules/dashboard/admin/settings/AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Only Admin can access
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Fetch all settings in parallel
    const [generalResult, systemResult, securityResult] = await Promise.all([
        getGeneralSettings(),
        getSystemSettings(),
        getSecuritySettings(),
    ]);

    const generalSettings = generalResult.success ? generalResult.data : null;
    const systemSettings = systemResult.success ? systemResult.data : null;
    const securitySettings = securityResult.success ? securityResult.data : null;

    return (
        <AdminSettingsClient
            generalSettings={generalSettings}
            systemSettings={systemSettings}
            securitySettings={securitySettings}
        />
    );
}