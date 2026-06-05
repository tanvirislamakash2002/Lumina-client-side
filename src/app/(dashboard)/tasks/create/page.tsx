import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { CreateTaskForm } from "@/components/modules/dashboard/tasks-add-edit/CreateTaskForm";
import { getUserProjects } from "@/actions/project-member.action";

export const dynamic = "force-dynamic";

interface CreateTaskPageProps {
    searchParams: Promise<{
        projectId?: string;
    }>;
}

export default async function CreateTaskPage({ searchParams }: CreateTaskPageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    // Only Admin and Project Manager can create tasks
    if (userRole !== "ADMIN" && userRole !== "PROJECT_MANAGER") {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const preselectedProjectId = params.projectId;

    // Fetch user's projects for the project selector
    const projectsResult = await getUserProjects({ page: 1, limit: 100 });
    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];

    return (
        <CreateTaskForm
            projects={projects}
            preselectedProjectId={preselectedProjectId}
            userRole={userRole}
        />
    );
}