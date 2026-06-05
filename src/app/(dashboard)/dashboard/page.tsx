import { getSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { Roles } from "@/constants/roles";

export default async function DashboardIndex() {
    const { data: session } = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;

    if (userRole === Roles.ADMIN) {
        redirect("/admin");
    } else {
        redirect("/dashboard");
    }
}