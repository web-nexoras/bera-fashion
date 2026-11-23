const configuredApiBaseUrl = process.env.API_BASE_URL;
export const API_BASE_URL = (configuredApiBaseUrl ?? "http://localhost:5000/api/v1").replace(/\/$/, "");
export const SESSION_ID_COOKIE = "bera_session_id";
export const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? "bera_auth";
export const API_TIMEOUT_MS = 3500;
export function apiPath(path) {
    return path.startsWith("/") ? path : `/${path}`;
}
export function backendUrl(path) {
    if (process.env.NODE_ENV === "production" && !process.env.API_BASE_URL) {
        throw new Error("API_BASE_URL must be configured in production.");
    }
    return `${API_BASE_URL}${apiPath(path)}`;
}
