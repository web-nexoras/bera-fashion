import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_TIMEOUT_MS, AUTH_COOKIE, SESSION_ID_COOKIE, backendUrl, isOfflineFallback, } from "@/lib/api/config";
import { toEnvelope } from "@/lib/api/server";
import { decodeSession } from "@/lib/api/session";
import { fallbackRequest } from "@/lib/fallback/handler";
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
    const fallbackBody = body instanceof FormData ? Object.fromEntries(body.entries()) : body;
    const multipartBody = body instanceof FormData;
    const cookieStore = await cookies();
    const session = decodeSession(cookieStore.get(AUTH_COOKIE)?.value);
    const token = session?.accessToken;
    const sessionId = cookieStore.get(SESSION_ID_COOKIE)?.value ?? crypto.randomUUID();
    const apiPathname = pathname.split("?")[0];
    const fallbackUserId = apiPathname === "orders/track" ? undefined : session?.user._id;
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
    if (isOfflineFallback()) {
        envelope = (await fallbackRequest(method, pathname, fallbackBody, fallbackUserId));
    }
    else {
        try {
            const response = await fetch(backendUrl(pathname), {
                method,
                headers: {
                    ...(!multipartBody ? { "Content-Type": "application/json" } : {}),
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    "X-Session-Id": sessionId,
                },
                body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
                signal: AbortSignal.timeout(API_TIMEOUT_MS),
                cache: "no-store",
            });
            envelope = await toEnvelope(response);
        }
        catch {
            envelope = process.env.NODE_ENV === "production"
                ? { success: false, message: "Service is temporarily unavailable. Please try again.", data: null, status: 503 }
                : (await fallbackRequest(method, pathname, fallbackBody, fallbackUserId));
        }
    }
    const response = NextResponse.json(envelope, { status: envelope.status ?? 200 });
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
