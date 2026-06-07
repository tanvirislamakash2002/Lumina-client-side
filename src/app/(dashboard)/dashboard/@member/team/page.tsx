import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getTeamMembersWithProjects } from "@/actions/user.action";
import { MemberTeamClient } from "@/components/modules/dashboard/member/team/MemberTeamClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        role?: string;
    }>;
}

export default async function MemberTeamPage({ searchParams }: PageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const params = await searchParams;
    const search = params.search || "";
    const role = params.role || "all";

    const currentUserId = session.user.id;
    const currentUserRole = session.user.role;

    // Fetch team members that are in projects with the current user
    const membersResult = await getTeamMembersWithProjects(
        currentUserId,
        currentUserRole,
        { search }
    );

    const members = membersResult.success ? membersResult.data?.members || [] : [];
    const totalMembers = membersResult.success ? membersResult.data?.total || 0 : 0;

    // Filter by role on the client side (or you can add role filter to the backend)
    const filteredMembers = role === "all" 
        ? members 
        : members.filter((member: any) => member.role === role);

    return (
        <MemberTeamClient
            members={filteredMembers}
            totalMembers={totalMembers}
            currentSearch={search}
            currentRole={role}
        />
    );
}