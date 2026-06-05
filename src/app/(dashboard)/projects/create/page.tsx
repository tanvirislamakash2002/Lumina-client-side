import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { Roles } from "@/constants/roles";
import { CreateProjectForm } from "@/components/modules/dashboard/projects-add-edit/CreateProjectForm";

export const dynamic = "force-dynamic";

export default async function CreateProjectPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    // Only Admin and Project Manager can create projects
    if (userRole !== Roles.ADMIN && userRole !== Roles.PROJECT_MANAGER) {
        redirect("/dashboard");
    }

    return <CreateProjectForm />;
}