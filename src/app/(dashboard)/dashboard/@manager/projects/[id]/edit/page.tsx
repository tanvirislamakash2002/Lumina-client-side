import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getProjectById } from "@/actions/project.action";
import { EditProjectClient } from "@/components/modules/dashboard/manager/projects/edit/EditProjectClient";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProjectPage({ params }: PageProps) {
    const { data: session } = await getSession();
    const { id: projectId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    // Only Project Managers and Admins can edit
    if (session.user.role !== "ADMIN" && session.user.role !== "PROJECT_MANAGER") {
        redirect(`/dashboard/projects/${projectId}`);
    }

    // Fetch project details
    const projectResult = await getProjectById(projectId);

    if (!projectResult.success || !projectResult.data) {
        redirect("/dashboard/projects");
    }

    const project = projectResult.data;

    return (
        <EditProjectClient
            project={project}
            projectId={projectId}
        />
    );
}