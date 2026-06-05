import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Roles } from "@/constants/roles";
import { getProjectById } from "@/actions/project.action";
import { EditProjectForm } from "@/components/modules/dashboard/projects-add-edit/EditProjectForm";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const { data: session } = await getSession();
    const { id: projectId } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    // Only Admin and Project Manager can edit projects
    if (userRole !== Roles.ADMIN && userRole !== Roles.PROJECT_MANAGER) {
        redirect(`/projects/${projectId}`);
    }

    // Fetch project details
    const projectResult = await getProjectById(projectId);

    if (!projectResult.success || !projectResult.data) {
        notFound();
    }

    return (
        <EditProjectForm 
            project={projectResult.data} 
            projectId={projectId}
        />
    );
}