import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { getAllProjects } from "@/actions/admin.action";
import { AdminProjectsClient } from "@/components/modules/dashboard/admin/projects/AdminProjectsClient";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        sort?: string;
    }>;
}

export default async function AdminProjectsPage({ searchParams }: PageProps) {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Only Admin can access
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = 20;
    const search = params.search || "";
    const status = params.status || "all";
    const sort = params.sort || "newest";

    const projectsResult = await getAllProjects({
        page,
        limit,
        search,
        status,
        sort,
    });

    const projects = projectsResult.success ? projectsResult.data?.projects || [] : [];
    const pagination = projectsResult.success ? projectsResult.data?.pagination : null;
    const stats = projectsResult.success ? projectsResult.data?.stats : null;

    return (
        <AdminProjectsClient
            initialProjects={projects}
            initialPagination={pagination}
            initialStats={stats}
            currentSearch={search}
            currentStatus={status}
            currentSort={sort}
            currentPage={page}
        />
    );
}