import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { TeamClient } from "@/components/modules/dashboard/team/TeamClient";
import { getTeamMembersWithProjects } from "@/actions/user.action";
import { getUserProjects } from "@/actions/project-member.action";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;
    const currentUserId = session.user.id;

    // Fetch team members (users who are in at least one project)
    const teamMembersResult = await getTeamMembersWithProjects(currentUserId, userRole);

    // Fetch projects for filtering
    const projectsResult = await getUserProjects({ page: 1, limit: 100 });
    const userProjects = projectsResult.success ? projectsResult.data?.projects || [] : [];

    return (
        <TeamClient 
            initialMembers={teamMembersResult.success ? teamMembersResult.data : null}
            initialProjects={userProjects}
            userRole={userRole}
            currentUserId={currentUserId}
        />
    );
}