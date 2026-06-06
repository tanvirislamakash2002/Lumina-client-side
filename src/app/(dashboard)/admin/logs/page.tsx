import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { LogsClient } from "@/components/modules/dashboard/admin/logs/LogsClient";
import { getSystemLogs } from "@/actions/admin.action";

export const dynamic = "force-dynamic";

interface LogsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        level?: string;
        days?: string;
        search?: string;
    }>;
}

export default async function LogsPage({ searchParams }: LogsPageProps) {
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
    const limit = parseInt(params.limit || "50");
    const level = params.level;
    const days = parseInt(params.days || "7");
    const search = params.search;

    const logsResult = await getSystemLogs({
        page,
        limit,
        level,
        days,
    });

    return (
        <LogsClient
            initialData={logsResult.success ? logsResult.data : null}
            currentPage={page}
            currentLimit={limit}
            currentLevel={level}
            currentDays={days}
            currentSearch={search}
        />
    );
}