import "server-only";
import { cookies } from "next/headers";
import { API_TIMEOUT_MS, AUTH_COOKIE, SESSION_ID_COOKIE, backendUrl } from "./config";
import { decodeSession } from "./session";
/** Serializes a Response into the uniform envelope used across the app. */
export async function toEnvelope(response) {
    let payload;
    try {
        payload = (await response.json());
    }
    catch {
        payload = {
            success: response.ok,
            message: response.ok ? "Request successful" : "Unexpected response from server",
            data: undefined,
        };
    }
    return { ...payload, status: response.status };
}
/**
 * Server-side API client (Server Components, Server Actions, Route Handlers).
 * Reads the JWT from an httpOnly cookie and forwards requests to the Express API.
 */
export async function serverFetch(path, options = {}) {
    const { body, token, sessionId, timeoutMs, headers, ...rest } = options;
    const apiPath = path.split("?")[0];
    const isPrivatePath = /^(users\/|orders\/(?!track(?:\/|$))|returns(?:\/|$)|wishlist(?:\/|$)|payments\/my-transactions|auth\/change-password)/.test(apiPath);
    // Public pages can stay statically renderable without reading request cookies.
    if (!isPrivatePath && !token && !sessionId) {
        try {
            const response = await fetch(backendUrl(path), {
                ...rest,
                headers: { "Content-Type": "application/json", ...headers },
                body: body === undefined ? undefined : JSON.stringify(body),
                signal: AbortSignal.timeout(timeoutMs ?? API_TIMEOUT_MS),
                cache: "no-store",
            });
            return await toEnvelope(response);
        }
        catch {
            return { success: false, message: "Service is temporarily unavailable. Please try again.", data: undefined, status: 503 };
        }
    }
    const cookieStore = await cookies();
    const session = decodeSession(cookieStore.get(AUTH_COOKIE)?.value);
    const storedToken = token ?? session?.accessToken ?? cookieStore.get("bera_access_token")?.value;
    const storedSession = sessionId ?? cookieStore.get(SESSION_ID_COOKIE)?.value;
    try {
        const response = await fetch(backendUrl(path), {
            ...rest,
            headers: {
                "Content-Type": "application/json",
                ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
                ...(storedSession ? { "X-Session-Id": storedSession } : {}),
                ...headers,
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: AbortSignal.timeout(timeoutMs ?? API_TIMEOUT_MS),
            cache: "no-store",
        });
        return await toEnvelope(response);
    }
    catch {
        return { success: false, message: "Service is temporarily unavailable. Please try again.", data: undefined, status: 503 };
    }
}
