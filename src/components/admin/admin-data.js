"use client";
import { useMutation, useQuery, } from "@tanstack/react-query";
import { adminRequest } from "@/api/admin.js";
export const emptyPagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
};
export function paginationFor(total, page = 1, limit = 10) {
    const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
    const safePage = Math.min(Math.max(1, page), totalPages);
    return {
        total,
        page: safePage,
        limit,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
    };
}
/**
 * Detects the fallback backend through the health endpoint. The BFF reports
 * `environment: "fallback"` when the Express API is unavailable or OFFLINE_FALLBACK is on.
 */
export function useFallbackMode() {
    const { data } = useQuery({
        queryKey: ["admin", "fallback-mode"],
        queryFn: async () => {
            const result = await adminRequest("health");
            return result.success && result.data?.environment === "fallback";
        },
        staleTime: Infinity,
        retry: false,
    });
    return Boolean(data);
}
/** Single-resource query with a deterministic fallback for offline rendering. */
export function useAdminQuery(key, path, fallback) {
    const query = useQuery({
        queryKey: [...key],
        queryFn: async () => {
            const result = await adminRequest(path);
            if (!result.success || result.data === undefined || result.data === null) {
                throw new Error(result.message || "Unable to load data.");
            }
            return result.data;
        },
        initialData: fallback,
        // Treat fallbacks as stale so the live API is always fetched in the background.
        initialDataUpdatedAt: 0,
    });
    return { ...query, data: query.data ?? fallback };
}
/** List query that normalizes the BFF envelope into rows + pagination. */
export function useAdminList(key, path, fallback = []) {
    const initial = {
        items: fallback,
        pagination: paginationFor(fallback.length, 1, fallback.length || 10),
    };
    const query = useQuery({
        queryKey: [...key],
        queryFn: async () => {
            const result = await adminRequest(path);
            if (!result.success)
                throw new Error(result.message || "Unable to load records.");
            const items = Array.isArray(result.data) ? result.data : [];
            return { items, pagination: result.pagination ?? paginationFor(items.length, 1, items.length || 10) };
        },
        initialData: initial,
        initialDataUpdatedAt: 0,
    });
    return { ...query, data: query.data ?? initial };
}
/**
 * Mutation wrapper. The fallback backend intentionally omits a handful of admin
 * write routes; in that case we accept the no-op and let the caller update its
 * local rows so the console remains fully interactive in fallback mode.
 */
export function useAdminAction() {
    const offlineFallback = useFallbackMode();
    return useMutation({
        mutationFn: async ({ path, method = "POST", body }) => {
            const result = await adminRequest(path, { method, body });
            const fallbackRouteMissing = offlineFallback && (result.status === 404 || /route not found/i.test(result.message ?? ""));
            if (!result.success && !fallbackRouteMissing) {
                throw new Error(result.message || "Request failed.");
            }
            return result.data;
        },
    });
}
/** Resolves populated-or-string relations returned by the API. */
export function entityName(value, fallback = "—") {
    if (!value)
        return fallback;
    if (typeof value === "string")
        return value;
    return value.name || value.email || fallback;
}
