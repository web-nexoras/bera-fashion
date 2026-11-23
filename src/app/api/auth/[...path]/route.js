import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_TIMEOUT_MS, AUTH_COOKIE, SESSION_ID_COOKIE, backendUrl } from "@/lib/api/config";
import { decodeSession, encodeSession } from "@/lib/api/session";
import { toEnvelope } from "@/lib/api/server";
import { firstIssue, forgotPasswordSchema, loginSchema, registerSchema, } from "@/lib/validation";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
};
function publicSession(payload) {
    return { user: payload.user, isAuthenticated: true };
}
async function callBackend(pathname, method, body, token) {
    const fullPath = pathname.startsWith("auth/") ? pathname : `auth/${pathname}`;
    try {
        const response = await fetch(backendUrl(fullPath), {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
            cache: "no-store",
        });
        return await toEnvelope(response);
    }
    catch {
        return { success: false, message: "Authentication service is temporarily unavailable.", data: null, status: 503 };
    }
}
export async function GET(request, context) {
    const { path } = await context.params;
    if (path.length === 1 && path[0] === "session") {
        const cookieStore = await cookies();
        const session = decodeSession(cookieStore.get(AUTH_COOKIE)?.value);
        return NextResponse.json(session
            ? { success: true, data: publicSession(session) }
            : { success: true, data: { user: null, isAuthenticated: false } });
    }
    return NextResponse.json({ success: false, message: "Authentication endpoint not found.", data: null }, { status: 404 });
}
export async function POST(request, context) {
    const { path } = await context.params;
    const pathname = path.join("/");
    const allowedPath = ["login", "register", "verify-email", "resend-otp", "forgot-password", "logout"].includes(pathname) || /^reset-password\/[^/]+$/.test(pathname) || /^verify-email\/[^/]+$/.test(pathname);
    if (!allowedPath) {
        return NextResponse.json({ success: false, message: "Authentication endpoint not found.", data: null }, { status: 404 });
    }
    const body = (await request.json().catch(() => ({})));
    const cookieStore = await cookies();
    // Server-side validation — the browser schema is a convenience, this is the
    // boundary that protects the backend from malformed or hostile payloads.
    const invalid = (message) => NextResponse.json({ success: false, message, data: null, status: 400 }, { status: 400 });
    let outgoing = body;
    if (pathname === "login") {
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success)
            return invalid(firstIssue(parsed.error));
        outgoing = { email: parsed.data.email, password: parsed.data.password };
    }
    else if (pathname === "register") {
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success)
            return invalid(firstIssue(parsed.error));
        outgoing = {
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            password: parsed.data.password,
        };
    }
    else if (pathname === "forgot-password") {
        const parsed = forgotPasswordSchema.safeParse(body);
        if (!parsed.success)
            return invalid(firstIssue(parsed.error));
        outgoing = { email: parsed.data.email };
    }
    if (pathname === "logout") {
        const response = NextResponse.json({ success: true, message: "Logged out successfully" });
        response.cookies.delete(AUTH_COOKIE);
        response.cookies.delete(SESSION_ID_COOKIE);
        response.cookies.delete("bera_access_token");
        return response;
    }
    const envelope = await callBackend(pathname, "POST", outgoing, cookieStore.get(AUTH_COOKIE)?.value
        ? decodeSession(cookieStore.get(AUTH_COOKIE)?.value)?.accessToken
        : undefined);
    if (!envelope.success) {
        return NextResponse.json(envelope, { status: envelope.status ?? 401 });
    }
    if ((pathname === "login" || pathname === "register") && envelope.data) {
        const data = envelope.data;
        if (data.user && data.accessToken) {
            const session = {
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken ?? data.accessToken,
            };
            const response = NextResponse.json({
                success: true,
                message: envelope.message,
                data: publicSession(session),
            });
            try {
                response.cookies.set(AUTH_COOKIE, encodeSession(session), cookieOptions);
            }
            catch {
                return NextResponse.json({ success: false, message: "Secure sign-in is temporarily unavailable.", data: null }, { status: 503 });
            }
            return response;
        }
    }
    return NextResponse.json(envelope, { status: envelope.status ?? 200 });
}
