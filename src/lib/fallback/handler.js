import { createHash } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { fallbackAddresses, fallbackAdmin, fallbackBrands, fallbackCategories, fallbackCoupons, fallbackCustomer, fallbackCustomers, fallbackDashboardStats, fallbackMonthlySales, fallbackOrders, fallbackProducts, fallbackReturns, fallbackShippingZones, fallbackStoreSettings, fallbackTransactions, findProduct, photo, } from "./data";
/** In-memory fallback state — mirrors the Express API response envelope. */
const state = {
    cart: [],
    coupon: null,
    wishlist: [],
    orders: [...fallbackOrders],
    addresses: [...fallbackAddresses],
    user: { ...fallbackCustomer },
    settings: { ...fallbackStoreSettings },
};
const stateByUser = new Map([[fallbackCustomer._id, state]]);
const fallbackContext = new AsyncLocalStorage();
const currentState = () => fallbackContext.getStore() ?? state;
stateByUser.set(fallbackAdmin._id, { ...state, user: { ...fallbackAdmin }, cart: [], coupon: null, wishlist: [], orders: [...fallbackOrders], addresses: [...fallbackAddresses], settings: { ...fallbackStoreSettings } });
const ok = (data, message = "Success", extra = {}) => ({
    success: true,
    message,
    data,
    ...extra,
});
const fail = (message, status = 400) => ({
    success: false,
    message,
    data: null,
    status,
});
const userIdOf = (user) => typeof user === "string" ? user : user?._id;
function paginate(items, page = 1, limit = 12) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const pagination = {
        total,
        page: safePage,
        limit,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
    };
    return { items: items.slice((safePage - 1) * limit, safePage * limit), pagination };
}
function cartSummary() {
    const subtotal = currentState().cart.reduce((sum, entry) => {
        const product = findProduct(entry.productId);
        const variant = product?.variants.find((item) => item._id === entry.variantId);
        return sum + (variant?.price ?? 0) * entry.quantity;
    }, 0);
    const coupon = fallbackCoupons.find((item) => item.code === currentState().coupon);
    const discountAmount = coupon
        ? coupon.type === "percentage"
            ? Math.min((subtotal * coupon.value) / 100, coupon.maximumDiscount ?? Infinity)
            : coupon.value
        : 0;
    const shippingCharge = currentState().cart.length === 0 || subtotal >= 5000 ? 0 : subtotal > 0 ? 60 : 0;
    return {
        subtotal,
        shippingCharge,
        discountAmount: Math.round(discountAmount),
        total: Math.max(0, subtotal + shippingCharge - discountAmount),
        itemCount: currentState().cart.reduce((sum, entry) => sum + entry.quantity, 0),
    };
}
function cartPayload() {
    return {
        _id: "cart_local",
        items: currentState().cart.flatMap((entry) => {
            const product = findProduct(entry.productId);
            const variant = product?.variants.find((item) => item._id === entry.variantId);
            if (!product || !variant)
                return [];
            return [{
                    _id: `ci_${entry.variantId}`,
                    productId: product._id,
                    variantId: variant._id,
                    name: product.name,
                    slug: product.slug,
                    image: product.images[0].url,
                    size: variant.size,
                    color: variant.color,
                    sku: variant.sku,
                    price: variant.price,
                    regularPrice: variant.regularPrice,
                    quantity: entry.quantity,
                    stock: variant.stock,
                    subtotal: variant.price * entry.quantity,
                }];
        }),
        appliedCoupon: fallbackCoupons.find((item) => item.code === currentState().coupon) ?? null,
        summary: cartSummary(),
    };
}
function filteredProducts(filters) {
    let items = fallbackProducts.filter((product) => product.status === "active");
    if (filters.category) {
        const category = fallbackCategories.find((item) => item.slug === filters.category || item._id === filters.category);
        items = category ? items.filter((product) => product.category._id === category._id) : [];
    }
    if (filters.brand) {
        const brand = fallbackBrands.find((item) => item.slug === filters.brand || item._id === filters.brand);
        items = brand ? items.filter((product) => product.brand?._id === brand._id) : [];
    }
    if (filters.search) {
        const term = filters.search.toLowerCase();
        items = items.filter((product) => product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.tags?.some((tag) => tag.includes(term)));
    }
    if (filters.isFeatured)
        items = items.filter((product) => product.isFeatured);
    if (filters.isNewArrival)
        items = items.filter((product) => product.isNewArrival);
    if (filters.isBestSeller)
        items = items.filter((product) => product.isBestSeller);
    if (filters.status)
        items = items.filter((product) => product.status === filters.status);
    switch (filters.sort) {
        case "price_asc":
            items = [...items].sort((a, b) => a.basePrice - b.basePrice);
            break;
        case "price_desc":
            items = [...items].sort((a, b) => b.basePrice - a.basePrice);
            break;
        case "popular":
            items = [...items].sort((a, b) => b.totalSold - a.totalSold);
            break;
        case "rating":
            items = [...items].sort((a, b) => b.averageRating - a.averageRating);
            break;
        case "oldest":
            items = [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            break;
        default: items = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return items;
}
/** Simulates any `/api/v1/*` route. Returns the same shape as the real backend. */
export async function fallbackRequest(method, pathname, body, userId) {
    const scopedState = userId
        ? stateByUser.get(userId) ?? { ...state, cart: [], coupon: null, wishlist: [], orders: [], addresses: [], user: { ...fallbackCustomer, _id: userId }, settings: { ...fallbackStoreSettings } }
        : state;
    if (userId && !stateByUser.has(userId))
        stateByUser.set(userId, scopedState);
    return fallbackContext.run(scopedState, async () => {
        const cleanPath = pathname.split("?")[0];
        const parts = cleanPath.split("/").filter(Boolean);
        const query = new URLSearchParams(pathname.includes("?") ? pathname.split("?")[1] : "");
        const payload = (body ?? {});
        const verb = method.toUpperCase();
        const numeric = (key, fallback) => Number(query.get(key) ?? fallback) || fallback;
        // -- Health ----------------------------------------------------------------
        if (verb === "GET" && parts[0] === "health") {
            return ok({ status: "ok", environment: "fallback" }, "BERA FASHION API is running");
        }
        // -- Auth ------------------------------------------------------------------
        if (parts[0] === "auth") {
            if (verb === "POST" && parts[1] === "login") {
                const email = String(payload.email ?? "").toLowerCase();
                const isAdmin = email.includes("admin");
                const emailHash = createHash("sha256").update(email || fallbackCustomer.email).digest("hex").slice(0, 12);
                const user = isAdmin ? fallbackAdmin : email === fallbackCustomer.email
                    ? { ...fallbackCustomer }
                    : { ...fallbackCustomer, _id: `usr_${emailHash}`, email: email || fallbackCustomer.email };
                if (!stateByUser.has(user._id)) {
                    stateByUser.set(user._id, isAdmin
                        ? { ...state, user: { ...user } }
                        : email === fallbackCustomer.email
                            ? state
                            : { ...state, cart: [], coupon: null, wishlist: [], orders: [], addresses: [], user: { ...user }, settings: { ...fallbackStoreSettings } });
                }
                return ok({ user, accessToken: `fallback-access-${user._id}`, refreshToken: `fallback-refresh-${user._id}` }, "Login successful");
            }
            if (verb === "POST" && parts[1] === "register") {
                const user = {
                    _id: `usr_${Date.now()}`,
                    name: String(payload.name ?? "New Customer"),
                    email: String(payload.email ?? "new@example.com"),
                    phone: payload.phone ? String(payload.phone) : undefined,
                    role: "customer",
                    isEmailVerified: false,
                    isBlocked: false,
                    createdAt: new Date().toISOString(),
                };
                stateByUser.set(user._id, { ...state, cart: [], coupon: null, wishlist: [], orders: [], addresses: [], user: { ...user }, settings: { ...fallbackStoreSettings } });
                return ok({ user, accessToken: `fallback-access-${user._id}`, refreshToken: `fallback-refresh-${user._id}` }, "Registration successful", { status: 201 });
            }
            if (verb === "POST" && parts[1] === "refresh-token") {
                return ok({ accessToken: "fallback-access-refreshed", refreshToken: "fallback-refresh-refreshed" }, "Tokens refreshed");
            }
            if (verb === "POST" && parts[1] === "logout")
                return ok(null, "Logged out successfully");
            if (verb === "PUT" && parts[1] === "change-password")
                return ok(null, "Password changed successfully");
            if (verb === "POST" && parts[1] === "forgot-password")
                return ok(null, "Password reset email sent");
            if (verb === "POST" && parts[1] === "verify-email")
                return ok(null, "Email verified successfully");
            if (verb.includes("reset-password"))
                return ok(null, "Password reset successful");
        }
        // -- Users -----------------------------------------------------------------
        if (parts[0] === "users") {
            if (parts[1] === "profile") {
                if (verb === "PUT") {
                    currentState().user = { ...currentState().user, name: String(payload.name ?? currentState().user.name), phone: String(payload.phone ?? currentState().user.phone) };
                }
                return ok(currentState().user, "Profile retrieved");
            }
            if (parts[1] === "addresses") {
                if (verb === "POST") {
                    const address = {
                        _id: `adr_${Date.now()}`,
                        label: payload.label ?? "home",
                        recipientName: String(payload.recipientName ?? ""),
                        phone: String(payload.phone ?? ""),
                        addressLine1: String(payload.addressLine1 ?? ""),
                        city: String(payload.city ?? ""),
                        district: String(payload.district ?? ""),
                        division: String(payload.division ?? ""),
                        postalCode: payload.postalCode ? String(payload.postalCode) : undefined,
                        isDefault: Boolean(payload.isDefault),
                    };
                    currentState().addresses.push(address);
                    return ok(address, "Address added", { status: 201 });
                }
                if (verb === "PUT" && parts[2]) {
                    const index = currentState().addresses.findIndex((item) => item._id === parts[2]);
                    if (index >= 0)
                        currentState().addresses[index] = { ...currentState().addresses[index], ...payload };
                    return ok(currentState().addresses[index], "Address updated");
                }
                if (verb === "DELETE" && parts[2]) {
                    currentState().addresses = currentState().addresses.filter((item) => item._id !== parts[2]);
                    return ok(null, "Address deleted");
                }
                return ok(currentState().addresses, "Addresses retrieved");
            }
        }
        // -- Categories / brands ---------------------------------------------------
        if (parts[0] === "categories" && verb === "GET") {
            if (parts[1] === "tree") {
                return ok(fallbackCategories.map((category) => ({ ...category, children: [], productCount: (category._id === "cat_new" ? fallbackProducts.filter((product) => product.isNewArrival).length : fallbackProducts.filter((product) => product.category._id === category._id).length) })), "Category tree");
            }
            if (parts[1]) {
                const category = fallbackCategories.find((item) => item._id === parts[1] || item.slug === parts[1]);
                return category ? ok(category, "Category retrieved") : fail("Category not found", 404);
            }
            return ok(fallbackCategories.map((category) => ({ ...category, productCount: (category._id === "cat_new" ? fallbackProducts.filter((product) => product.isNewArrival).length : fallbackProducts.filter((product) => product.category._id === category._id).length) })), "Categories retrieved");
        }
        if (parts[0] === "brands" && verb === "GET") {
            if (parts[1]) {
                const brand = fallbackBrands.find((item) => item._id === parts[1] || item.slug === parts[1]);
                return brand ? ok(brand, "Brand retrieved") : fail("Brand not found", 404);
            }
            return ok(fallbackBrands, "Brands retrieved");
        }
        // -- Products --------------------------------------------------------------
        if (parts[0] === "products") {
            if (verb === "POST" || verb === "PUT" || verb === "DELETE") {
                return ok({ _id: parts[1] ?? `prd_${Date.now()}` }, "Product saved successfully", { status: verb === "POST" ? 201 : 200 });
            }
            if (parts[1] === "featured")
                return ok(fallbackProducts.filter((product) => product.isFeatured), "Featured products");
            if (parts[1] === "new-arrivals")
                return ok(fallbackProducts.filter((product) => product.isNewArrival), "New arrivals");
            if (parts[1] === "best-sellers")
                return ok(fallbackProducts.filter((product) => product.isBestSeller), "Best sellers");
            if (parts[1]) {
                const product = findProduct(parts[1]);
                if (!product)
                    return fail("Product not found", 404);
                if (parts[2] === "related") {
                    return ok(fallbackProducts.filter((item) => item.category._id === product.category._id && item._id !== product._id).slice(0, 8), "Related products");
                }
                return ok(product, "Product retrieved");
            }
            const filters = {
                page: numeric("page", 1),
                limit: numeric("limit", 12),
                category: query.get("category") ?? undefined,
                brand: query.get("brand") ?? undefined,
                search: query.get("search") ?? undefined,
                sort: query.get("sort") ?? "newest",
                isFeatured: query.get("isFeatured") === "true" || undefined,
                isNewArrival: query.get("isNewArrival") === "true" || undefined,
                isBestSeller: query.get("isBestSeller") === "true" || undefined,
                status: query.get("status") ?? undefined,
            };
            const { items, pagination } = paginate(filteredProducts(filters), filters.page, filters.limit);
            return ok(items, "Products retrieved", { pagination });
        }
        // -- Inventory -------------------------------------------------------------
        if (parts[0] === "inventory" && verb === "GET") {
            if (parts[1] === "low-stock")
                return ok(fallbackProducts.flatMap((product) => product.variants.filter((variant) => variant.stock > 0 && variant.stock <= 8).map((variant) => ({ ...variant, productName: product.name, productImage: product.images[0].url }))), "Low stock variants");
            if (parts[1] === "out-of-stock")
                return ok(fallbackProducts.flatMap((product) => product.variants.filter((variant) => variant.stock === 0).map((variant) => ({ ...variant, productName: product.name, productImage: product.images[0].url }))), "Out of stock variants");
            const inventory = fallbackProducts.flatMap((product) => product.variants.map((variant) => ({ ...variant, productName: product.name, productImage: product.images[0].url, sku: variant.sku })));
            const { items, pagination } = paginate(inventory, numeric("page", 1), numeric("limit", 20));
            return ok(items, "Inventory retrieved", { pagination });
        }
        if (parts[0] === "inventory" && verb === "POST")
            return ok(null, "Stock adjusted successfully");
        // -- Cart ------------------------------------------------------------------
        if (parts[0] === "cart") {
            if (verb === "GET" && parts[1] === "summary")
                return ok(cartSummary(), "Cart summary");
            if (verb === "GET" && !parts[1])
                return ok(cartPayload(), "Cart retrieved");
            if (verb === "DELETE" && parts[1] === "coupon") {
                currentState().coupon = null;
                return ok(cartPayload(), "Coupon removed");
            }
            if (verb === "POST" && parts[1] === "coupon") {
                const code = String(payload.code ?? "").toUpperCase();
                const coupon = fallbackCoupons.find((item) => item.code === code && item.isActive);
                if (!coupon)
                    return fail("Invalid or expired coupon", 400);
                if (cartSummary().subtotal < coupon.minimumOrderAmount)
                    return fail(`Minimum order amount is ৳${coupon.minimumOrderAmount}`, 400);
                currentState().coupon = code;
                return ok(cartPayload(), "Coupon applied");
            }
            if (verb === "POST" && parts[1] === "items") {
                const productId = String(payload.productId ?? "");
                const variantId = String(payload.variantId ?? "");
                const product = findProduct(productId);
                const variant = product?.variants.find((item) => item._id === variantId);
                if (!product || !variant)
                    return fail("Product or variant not found", 404);
                const existing = currentState().cart.find((item) => item.variantId === variantId);
                const quantity = Number(payload.quantity ?? 1);
                if (existing)
                    existing.quantity += quantity;
                else
                    currentState().cart.push({ productId, variantId, quantity });
                return ok(cartPayload(), "Item added to cart", { status: 201 });
            }
            if (parts[1] === "items" && parts[2]) {
                const entry = currentState().cart.find((item) => item.variantId === parts[2]);
                if (verb === "DELETE")
                    currentState().cart = currentState().cart.filter((item) => item.variantId !== parts[2]);
                if (verb === "PUT" && entry)
                    entry.quantity = Math.max(1, Number(payload.quantity ?? entry.quantity));
                return ok(cartPayload(), "Cart updated");
            }
            if (verb === "DELETE") {
                currentState().cart = [];
                currentState().coupon = null;
                return ok(cartPayload(), "Cart cleared");
            }
        }
        // -- Wishlist --------------------------------------------------------------
        if (parts[0] === "wishlist") {
            if (verb === "GET")
                return ok(fallbackProducts.filter((product) => currentState().wishlist.includes(product._id)), "Wishlist retrieved");
            if (verb === "DELETE" && parts[1] === "items" && parts[2]) {
                currentState().wishlist = currentState().wishlist.filter((id) => id !== parts[2]);
                return ok(null, "Removed from wishlist");
            }
            if (verb === "POST" && parts[1] === "items") {
                const productId = String(payload.productId ?? "");
                if (!currentState().wishlist.includes(productId))
                    currentState().wishlist.push(productId);
                return ok(null, "Added to wishlist");
            }
            if (verb === "DELETE") {
                currentState().wishlist = [];
                return ok(null, "Wishlist cleared");
            }
        }
        // -- Coupons ---------------------------------------------------------------
        if (parts[0] === "coupons") {
            if (verb === "POST" && parts[1] === "validate") {
                const coupon = fallbackCoupons.find((item) => item.code === String(payload.code ?? "").toUpperCase() && item.isActive);
                if (!coupon)
                    return fail("Invalid coupon code", 400);
                const amount = Number(payload.orderAmount ?? 0);
                const discount = coupon.type === "percentage" ? Math.min((amount * coupon.value) / 100, coupon.maximumDiscount ?? Infinity) : coupon.value;
                return ok({ coupon, discountAmount: Math.round(discount), total: amount - Math.round(discount) }, "Coupon valid");
            }
            if (verb === "POST")
                return ok({ ...payload, _id: `cpn_${Date.now()}` }, "Coupon created", { status: 201 });
            return ok(fallbackCoupons, "Coupons retrieved");
        }
        // -- Orders ----------------------------------------------------------------
        if (parts[0] === "orders") {
            if (verb === "POST" && parts[1] === "checkout") {
                const shipping = payload.shippingAddress;
                const summary = cartSummary();
                if (!currentState().cart.length)
                    return fail("Your cart is empty", 400);
                const order = {
                    _id: `ord_${Date.now()}`,
                    orderNumber: `BF-2026-${Date.now().toString().slice(-6).toUpperCase()}`,
                    user: currentState().user,
                    items: cartPayload().items,
                    shippingAddress: shipping,
                    pricing: { subtotal: summary.subtotal, shippingCharge: summary.shippingCharge, discountAmount: summary.discountAmount, total: summary.total },
                    paymentMethod: payload.paymentMethod ?? "cod",
                    paymentStatus: "pending",
                    orderStatus: "pending",
                    notes: payload.notes ? String(payload.notes) : undefined,
                    createdAt: new Date().toISOString(),
                };
                currentState().orders.unshift(order);
                currentState().cart = [];
                currentState().coupon = null;
                return ok({ order, paymentUrl: order.paymentMethod === "sslcommerz" ? "https://sandbox.sslcommerz.com/" : undefined }, "Order placed successfully", { status: 201 });
            }
            if (verb === "GET" && parts[1] === "track") {
                const normalizePhone = (value) => {
                    const digits = value.replace(/\D/g, "");
                    return digits.startsWith("880") ? `0${digits.slice(3)}` : digits;
                };
                const phone = normalizePhone(query.get("phone") ?? "");
                if (!phone)
                    return fail("Enter the phone number used at checkout.", 400);
                const order = currentState().orders.find((item) => item.orderNumber.toLowerCase() === String(query.get("orderNumber") ?? "").toLowerCase() &&
                    normalizePhone(item.shippingAddress.phone) === phone);
                return order ? ok(order, "Order found") : fail("Order not found", 404);
            }
            if (verb === "GET" && parts[1] === "admin" && parts[2] === "all") {
                const { items, pagination } = paginate(currentState().orders, numeric("page", 1), numeric("limit", 10));
                return ok(items, "Orders retrieved", { pagination });
            }
            if (verb === "PUT" && parts[1] === "admin" && parts[2]) {
                const order = currentState().orders.find((item) => item._id === parts[2]);
                if (order)
                    order.orderStatus = payload.status ?? order.orderStatus;
                return ok(order, "Order status updated");
            }
            if (verb === "GET" && parts[1] === "my" && parts[2]) {
                const order = currentState().orders.find((item) => item._id === parts[2] && userIdOf(item.user) === currentState().user._id);
                return order ? ok(order, "Order retrieved") : fail("Order not found", 404);
            }
            if (verb === "POST" && parts[2] === "cancel") {
                const order = currentState().orders.find((item) => item._id === parts[1] && userIdOf(item.user) === currentState().user._id);
                if (order)
                    order.orderStatus = "cancelled";
                return ok(order, "Order cancelled");
            }
            if (verb === "GET") {
                const ownedOrders = currentState().orders.filter((item) => userIdOf(item.user) === currentState().user._id);
                const { items, pagination } = paginate(ownedOrders.slice(0, 8), numeric("page", 1), numeric("limit", 10));
                return ok(items, "Orders retrieved", { pagination });
            }
        }
        // -- Payments / shipping / returns -----------------------------------------
        if (parts[0] === "payments") {
            if (verb === "POST" && parts[1] === "initiate")
                return ok({ paymentUrl: "https://sandbox.sslcommerz.com/", transactionId: `SSL-fallback-${Date.now()}` }, "Payment initiated");
            if (parts[1] === "admin" && parts[2] === "all")
                return ok(fallbackTransactions, "Transactions retrieved");
            const ownedOrderIds = new Set(currentState().orders.filter((order) => userIdOf(order.user) === currentState().user._id).map((order) => order._id));
            return ok(fallbackTransactions.filter((item) => ownedOrderIds.has(item.orderId) && userIdOf(item.user) === currentState().user._id).slice(0, 6), "Transactions retrieved");
        }
        if (parts[0] === "shipping") {
            if (parts[1] === "charge")
                return ok({ charge: String(query.get("district") ?? "").toLowerCase() === "dhaka" ? 60 : 120, estimatedDays: "3-5 days" }, "Shipping charge calculated");
            return ok(fallbackShippingZones, "Shipping zones retrieved");
        }
        if (parts[0] === "returns") {
            if (verb === "POST")
                return ok({ ...payload, _id: `ret_${Date.now()}`, returnNumber: `RET-${Date.now().toString().slice(-4)}`, status: "requested", createdAt: new Date().toISOString() }, "Return requested", { status: 201 });
            if (parts[1] === "admin")
                return ok(fallbackReturns, "Returns retrieved");
            return ok(fallbackReturns.filter((item) => userIdOf(item.user) === currentState().user._id), "Returns retrieved");
        }
        // -- Admin -----------------------------------------------------------------
        if (parts[0] === "admin") {
            if (parts[1] === "dashboard" && parts[2] === "monthly-sales")
                return ok(fallbackMonthlySales, "Monthly sales retrieved");
            if (parts[1] === "dashboard")
                return ok(fallbackDashboardStats, "Dashboard stats retrieved");
            if (parts[1] === "reports" && parts[2] === "sales")
                return ok(fallbackMonthlySales, "Sales report retrieved");
            if (parts[1] === "reports" && parts[2] === "inventory")
                return ok({ totalVariants: fallbackProducts.reduce((sum, product) => sum + product.variants.length, 0), lowStock: 14, outOfStock: 6, totalValue: 2486000 }, "Inventory report retrieved");
            if (parts[1] === "customers") {
                const { items, pagination } = paginate(fallbackCustomers, numeric("page", 1), numeric("limit", 10));
                return ok(items, "Customers retrieved", { pagination });
            }
            if (parts[1] === "settings") {
                if (verb === "PUT")
                    currentState().settings = { ...currentState().settings, ...payload };
                return ok(currentState().settings, "Settings retrieved");
            }
        }
        return fail(`Route not found: ${verb} ${pathname}`, 404);
    });
}
/** Convenience: seed a few fallback cart/wishlist entries for a lively first render. */
export function seedFallbackActivity() {
    if (currentState().wishlist.length || currentState().cart.length)
        return;
    currentState().wishlist.push(fallbackProducts[6]._id, fallbackProducts[19]._id);
}
seedFallbackActivity();
export const fallbackImage = photo("photo-1441986300917-64674bd600d8", 1200);
