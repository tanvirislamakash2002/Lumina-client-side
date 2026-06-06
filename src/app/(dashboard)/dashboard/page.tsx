import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    return null;
}