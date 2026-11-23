export const API_BASE_URL = (process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:5000/api/v1").replace(/\/$/, "");
export const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "bera_session";
export const SESSION_ID_COOKIE = "bera_session_id";
export const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? "bera_auth";
export const isOfflineFallback = () => process.env.NODE_ENV !== "production" && process.env.OFFLINE_FALLBACK === "true";
export const API_TIMEOUT_MS = 3500;
export function apiPath(path) {
    return path.startsWith("/") ? path : `/${path}`;
}
export function backendUrl(path) {
    return `${API_BASE_URL}${apiPath(path)}`;
}
