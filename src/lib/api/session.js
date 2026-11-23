import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { AUTH_COOKIE, SESSION_ID_COOKIE } from "./config";
export function encodeSession(session) {
    const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
    return `${payload}.${sign(payload)}`;
}
export function decodeSession(value) {
    if (!value)
        return null;
    try {
        const [payload, signature, ...extra] = value.split(".");
        if (!payload || !signature || extra.length || !safeEqual(signature, sign(payload)))
            return null;
        const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (!parsed.user?._id || !parsed.user.role || !parsed.accessToken)
            return null;
        return parsed;
    }
    catch {
        return null;
    }
}
function sign(payload) {
    const secret = process.env.AUTH_SECRET ?? (process.env.NODE_ENV === "production" ? "" : "bera-local-session-key-for-local-development-only");
    if (Buffer.byteLength(secret, "utf8") < 32)
        throw new Error("AUTH_SECRET must contain at least 32 bytes before issuing production sessions.");
    return createHmac("sha256", secret).update(payload).digest("base64url");
}
function safeEqual(left, right) {
    const a = Buffer.from(left);
    const b = Buffer.from(right);
    return a.length === b.length && timingSafeEqual(a, b);
}
export async function getSession() {
    const cookieStore = await cookies();
    return decodeSession(cookieStore.get(AUTH_COOKIE)?.value);
}
export async function getSessionId() {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_ID_COOKIE)?.value;
}
export function isAdmin(user) {
    return user?.role === "admin";
}
