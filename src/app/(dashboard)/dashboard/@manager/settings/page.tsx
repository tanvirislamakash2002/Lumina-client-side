import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getNotificationSettings, getThemeSettings, getSecuritySettings } from "@/actions/settings.action";
import { SettingsClient } from "@/components/modules/dashboard/manager/settings/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch all settings in parallel
    const [notificationResult, themeResult, securityResult] = await Promise.all([
        getNotificationSettings(),
        getThemeSettings(),
        getSecuritySettings(),
    ]);

    const notificationSettings = notificationResult.success ? notificationResult.data : null;
    const themeSettings = themeResult.success ? themeResult.data : null;
    const securitySettings = securityResult.success ? securityResult.data : null;

    const userRole = session.user.role;
    const isAdmin = userRole === "ADMIN";

    return (
        <SettingsClient
            notificationSettings={notificationSettings}
            themeSettings={themeSettings}
            securitySettings={securitySettings}
            isAdmin={isAdmin}
        />
    );
}