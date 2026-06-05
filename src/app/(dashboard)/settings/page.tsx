import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/modules/dashboard/settings/SettingsClient";
import { getNotificationSettings } from "@/actions/settings.action";
import { getThemeSettings } from "@/actions/settings.action";
import { getSecuritySettings } from "@/actions/settings.action";
import { getSessions } from "@/actions/settings.action";
import { getGeneralSettings } from "@/actions/settings.action";
import { getSystemSettings } from "@/actions/settings.action";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;
    const currentUserId = session.user.id;

    // Fetch all settings in parallel
    const [
        notificationsResult,
        themeResult,
        securityResult,
        sessionsResult,
        generalResult,
        systemResult,
    ] = await Promise.all([
        getNotificationSettings(),
        getThemeSettings(),
        getSecuritySettings(),
        getSessions(),
        userRole === "ADMIN" ? getGeneralSettings() : Promise.resolve({ success: false, data: null }),
        userRole === "ADMIN" ? getSystemSettings() : Promise.resolve({ success: false, data: null }),
    ]);

    return (
        <SettingsClient
            userRole={userRole}
            currentUserId={currentUserId}
            notifications={notificationsResult.success ? notificationsResult.data : null}
            theme={themeResult.success ? themeResult.data : null}
            security={securityResult.success ? securityResult.data : null}
            sessions={sessionsResult.success ? sessionsResult.data : null}
            general={generalResult.success ? generalResult.data : null}
            system={systemResult.success ? systemResult.data : null}
        />
    );
}