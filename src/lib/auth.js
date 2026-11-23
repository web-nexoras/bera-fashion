import "server-only";
import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/api/session";
/** Server-side guards for protected layouts. */
export async function requireUser(returnTo = "/account") {
    const session = await getSession();
    if (!session || session.user.isBlocked)
        redirect(`/sign-in?next=${encodeURIComponent(returnTo)}`);
    return session;
}
export async function requireAdmin(returnTo = "/admin") {
    const session = await getSession();
    if (!session || session.user.isBlocked)
        redirect(`/sign-in?next=${encodeURIComponent(returnTo)}`);
    if (!isAdmin(session.user))
        redirect("/account?error=forbidden");
    return session;
}
