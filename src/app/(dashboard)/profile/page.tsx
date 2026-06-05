import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/modules/dashboard/profile/ProfileClient";
import { getProfile } from "@/actions/user.action";
import { getNotificationSettings } from "@/actions/settings.action";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const user = session.user;

    // Fetch profile data and notification settings in parallel
    const [profileResult, settingsResult] = await Promise.all([
        getProfile(),
        getNotificationSettings(),
    ]);

    const profile = profileResult.success ? profileResult.data : null;
    const settings = settingsResult.success ? settingsResult.data : null;

    return (
        <ProfileClient
            user={user}
            profile={profile}
            settings={settings}
        />
    );
}