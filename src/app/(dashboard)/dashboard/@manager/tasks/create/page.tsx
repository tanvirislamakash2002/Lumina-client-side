import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getProjects } from "@/actions/project.action";
import { getTeamMembers } from "@/actions/user.action";
import { CreateTaskClient } from "@/components/modules/dashboard/manager/tasks/create/CreateTaskClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        projectId?: string;
    }>;
}

export default async function CreateTaskPage({ searchParams }: PageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Only Project Managers and Admins can create tasks
    if (session.user.role !== "ADMIN" && session.user.role !== "PROJECT_MANAGER") {
        redirect("/dashboard/tasks");
    }

    const params = await searchParams;
    const preSelectedProjectId = params.projectId || "";

    // Fetch projects and team members in parallel
    const [projectsResult, membersResult] = await Promise.all([
        getProjects({ page: 1, limit: 100 }),
        getTeamMembers(),
    ]);

    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const members = membersResult.success ? membersResult.data || [] : [];

    return (
        <CreateTaskClient
            projects={projects}
            members={members}
            preSelectedProjectId={preSelectedProjectId}
            currentUser={{ id: session?.user?.id, role: session?.user?.role }}
        />
    );
}