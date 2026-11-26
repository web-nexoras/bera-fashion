import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_TIMEOUT_MS, AUTH_COOKIE, SESSION_ID_COOKIE, backendUrl } from "@/lib/api/config";
import { toEnvelope } from "@/lib/api/server";
import { decodeSession, encodeSession } from "@/lib/api/session";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function forward(request, context) {
    const { path } = await context.params;
    const pathname = `${path.join("/")}${request.nextUrl.search}`;
    const method = request.method.toUpperCase();
    let body;
    const isMultipart = request.headers.get("content-type")?.includes("multipart/form-data") ?? false;
    if (isMultipart) {
        try {
            body = await request.formData();
        }
        catch {
            return NextResponse.json({ success: false, message: "Invalid form data.", data: null }, { status: 400 });
        }
    }
    else {
        const bodyText = await request.text();
        try {
            body = bodyText ? JSON.parse(bodyText) : undefined;
        }
        catch {
            return NextResponse.json({ success: false, message: "Request body must be valid JSON.", data: null }, { status: 400 });
        }
    }
    const multipartBody = body instanceof FormData;
    const cookieStore = await cookies();
    const session = decodeSession(cookieStore.get(AUTH_COOKIE)?.value);
    const token = session?.accessToken;
    const sessionId = cookieStore.get(SESSION_ID_COOKIE)?.value ?? crypto.randomUUID();
    const apiPathname = pathname.split("?")[0];
    const requiresAccount = /^(users\/|orders\/(?!track(?:\/|$))|returns(?:\/|$)|wishlist(?:\/|$)|payments\/my-transactions|auth\/change-password)/.test(apiPathname);
    const adminRead = /^(admin\/|users\/admin\/|orders\/admin\/|payments\/admin\/|returns\/admin\/|inventory(?:\/|$)|coupons(?!\/validate(?:\/|$))(?:\/|$)|settings(?:\/|$))/.test(apiPathname);
    const adminMutation = method !== "GET" && /^(inventory(?:\/|$)|products(?:\/|$)|brands(?:\/|$)|categories(?:\/|$)|shipping(?:\/|$)|settings(?:\/|$)|coupons(?!\/validate(?:\/|$))(?:\/|$))/.test(apiPathname);
    const requiresAdmin = adminRead || adminMutation;
    if (requiresAccount && (!session || session.user.isBlocked)) {
        return NextResponse.json({ success: false, message: "Please sign in to continue.", data: null }, { status: 401 });
    }
    if (requiresAdmin && (session?.user.role !== "admin" || session.user.isBlocked)) {
        return NextResponse.json({ success: false, message: "Administrator access required.", data: null }, { status: 403 });
    }
    let envelope;
    let refreshedSession = null;
    const sendToBackend = async (bearerToken) => {
        const response = await fetch(backendUrl(pathname), {
            method,
            headers: {
                ...(!multipartBody ? { "Content-Type": "application/json" } : {}),
                ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
                "X-Session-Id": sessionId,
            },
            body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
            cache: "no-store",
        });
        return await toEnvelope(response);
    };
    try {
        envelope = await sendToBackend(token);
        if (envelope.status === 401 && session?.refreshToken) {
            const refreshResponse = await fetch(backendUrl("auth/refresh-token"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: session.refreshToken }),
                signal: AbortSignal.timeout(API_TIMEOUT_MS),
                cache: "no-store",
            });
            const refreshEnvelope = await toEnvelope(refreshResponse);
            if (refreshEnvelope.success && refreshEnvelope.data?.accessToken) {
                refreshedSession = {
                    ...session,
                    accessToken: refreshEnvelope.data.accessToken,
                    refreshToken: refreshEnvelope.data.refreshToken ?? session.refreshToken,
                };
                envelope = await sendToBackend(refreshedSession.accessToken);
            }
        }
    }
    catch {
        envelope = { success: false, message: "Service is temporarily unavailable. Please try again.", data: null, status: 503 };
    }
    const response = NextResponse.json(envelope, { status: envelope.status ?? 200 });
    if (refreshedSession) {
        try {
            response.cookies.set(AUTH_COOKIE, encodeSession(refreshedSession), {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
        }
        catch {
            // Keep response intact if session re-encoding fails.
        }
    }
    response.cookies.set(SESSION_ID_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });
    return response;
}
export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
