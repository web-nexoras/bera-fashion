import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function formatBDT(amount, withSymbol = true) {
    const formatted = new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);
    return withSymbol ? `৳${formatted}` : formatted;
}
export function formatCompact(amount) {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(amount);
}
export function formatDate(value, pattern = "dd MMM yyyy") {
    if (!value)
        return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : format(date, pattern);
}
export function formatDateTime(value) {
    return formatDate(value, "dd MMM yyyy, h:mm a");
}
export function timeAgo(value) {
    if (!value)
        return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : formatDistanceToNow(date, { addSuffix: true });
}
export function mainImage(images) {
    if (!images?.length)
        return "/images/placeholder.svg";
    return images.find((image) => image.isMain)?.url ?? images[0].url;
}
export function productPrice(product) {
    const active = product.variants?.filter((variant) => variant.isActive);
    if (!active?.length)
        return product.basePrice;
    return Math.min(...active.map((variant) => variant.price));
}
export function productCompareAt(product) {
    const active = product.variants?.filter((variant) => variant.isActive);
    if (!active?.length)
        return product.compareAtPrice;
    const max = Math.max(...active.map((variant) => variant.regularPrice));
    return max > productPrice(product) ? max : product.compareAtPrice;
}
export function discountPercent(price, compareAt) {
    if (!compareAt || compareAt <= price)
        return 0;
    return Math.round(((compareAt - price) / compareAt) * 100);
}
export function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
export function truncate(value, length = 100) {
    return value.length > length ? `${value.slice(0, length).trimEnd()}…` : value;
}
export function initials(name) {
    if (!name)
        return "N";
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}
export function statusTone(status) {
    const map = {
        active: "success",
        paid: "success",
        delivered: "success",
        approved: "success",
        completed: "success",
        confirmed: "info",
        processing: "info",
        shipped: "info",
        pending: "warning",
        requested: "warning",
        draft: "neutral",
        inactive: "neutral",
        cancelled: "danger",
        failed: "danger",
        refunded: "danger",
        rejected: "danger",
        out_of_stock: "danger",
    };
    return map[status] ?? "neutral";
}
export function titleCase(value) {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
export function buildQuery(params = {}) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "")
            return;
        search.set(key, String(value));
    });
    const query = search.toString();
    return query ? `?${query}` : "";
}
