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
/** Single-resource query backed only by the live API. */
export function useAdminQuery(key, path) {
    const query = useQuery({
        queryKey: [...key],
        queryFn: async () => {
            const result = await adminRequest(path);
            if (!result.success || result.data === undefined || result.data === null) {
                throw new Error(result.message || "Unable to load data.");
            }
            return result.data;
        },
    });
    return query;
}
/** List query that normalizes the BFF envelope into rows + pagination. */
export function useAdminList(key, path) {
    const initial = {
        items: [],
        pagination: emptyPagination,
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
    });
    return { ...query, data: query.data ?? initial };
}
/** Mutation wrapper for live admin endpoints. */
export function useAdminAction() {
    return useMutation({
        mutationFn: async ({ path, method = "POST", body }) => {
            const result = await adminRequest(path, { method, body });
            if (!result.success) {
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
