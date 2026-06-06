import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { UsersClient } from "@/components/modules/dashboard/admin/users/UsersClient";
import { getAllUsers } from "@/actions/user.action";

export const dynamic = "force-dynamic";

interface UsersPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        role?: string;
        status?: string;
        verified?: string;
        sort?: string;
        limit?: string;
    }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
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
    const role = params.role;
    const status = params.status;
    const verified = params.verified;
    const sort = params.sort;

    const usersResult = await getAllUsers({
        page,
        limit,
        search,
        role,
        status,
        verified,
        sort,
    });

    return (
        <UsersClient
            initialData={usersResult.success ? usersResult.data : null}
            currentUserId={session.user.id}
            currentPage={page}
            currentSearch={search}
            currentRole={role}
            currentStatus={status}
            currentVerified={verified}
            currentSort={sort}
        />
    );
}