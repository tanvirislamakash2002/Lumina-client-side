import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getTeamMembers } from "@/actions/user.action";
import { CreateProjectClient } from "@/components/modules/dashboard/manager/projects/create/CreateProjectClient";

export const dynamic = "force-dynamic";

export default async function CreateProjectPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Only Project Managers and Admins can access
    if (session.user.role !== "ADMIN" && session.user.role !== "PROJECT_MANAGER") {
        redirect("/dashboard");
    }

    // Fetch team members for task assignment (optional - if you want to pre-assign members)
    const membersResult = await getTeamMembers();
    const members = membersResult.success ? membersResult.data || [] : [];

    return (
        <CreateProjectClient members={members} />
    );
}