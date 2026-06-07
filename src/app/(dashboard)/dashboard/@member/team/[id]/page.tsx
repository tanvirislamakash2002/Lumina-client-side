import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getUserById } from "@/actions/user.action";
import { getUserProjectsById } from "@/actions/project-member.action";
import { MemberTeamMemberDetailsClient } from "@/components/modules/dashboard/member/team-details/MemberTeamMemberDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MemberTeamMemberDetailsPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: userId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    const currentUserId = session.user.id;
    const currentUserRole = session.user.role;

    // If viewing own profile, redirect to profile page
    if (currentUserId === userId) {
        redirect("/dashboard/profile");
    }

    // Fetch user details
    const userResult = await getUserById(userId);

    if (!userResult.success || !userResult.data) {
        redirect("/dashboard/team");
    }

    const user = userResult.data;

    // Fetch shared projects (projects both users are members of)
    const currentUserProjects = await getUserProjectsById(currentUserId, { page: 1, limit: 100 });
    const targetUserProjects = await getUserProjectsById(userId, { page: 1, limit: 100 });

    const currentUserProjectIds = new Set(
        (currentUserProjects.success ? currentUserProjects.data?.projects || [] : [])
            .map((p: any) => p.id)
    );

    const sharedProjects = (targetUserProjects.success ? targetUserProjects.data?.projects || [] : [])
        .filter((project: any) => currentUserProjectIds.has(project.id));

    // If no shared projects and user is not admin, redirect
    if (sharedProjects.length === 0 && currentUserRole !== "ADMIN") {
        redirect("/dashboard/team");
    }

    return (
        <MemberTeamMemberDetailsClient
            user={user}
            sharedProjects={sharedProjects}
        />
    );
}