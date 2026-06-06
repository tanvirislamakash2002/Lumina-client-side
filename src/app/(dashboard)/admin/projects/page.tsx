import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { AdminProjectsClient } from "@/components/modules/dashboard/admin/projects/AdminProjectsClient";
import { getAllProjects } from "@/actions/admin.action";

export const dynamic = "force-dynamic";

interface AdminProjectsPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        sort?: string;
        limit?: string;
    }>;
}

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    if (userRole !== "ADMIN") {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = parseInt(params.limit || "15");
    const search = params.search;
    const status = params.status;
    const sort = params.sort;

    const projectsResult = await getAllProjects({
        page,
        limit,
        search,
        status,
        sort,
    });

    return (
        <AdminProjectsClient
            initialData={projectsResult.success ? projectsResult.data : null}
            currentPage={page}
            currentSearch={search}
            currentStatus={status}
            currentSort={sort}
        />
    );
}