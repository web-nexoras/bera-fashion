export const SITE = {
    name: "BERA FASHION",
    shortName: "BERA",
    tagline: "Modern elegance, made for everyday.",
    description: "Discover premium fashion curated for the modern you. Quality fabrics, thoughtful design, and effortless style.",
    email: "support@berafashion.com",
    phone: "+880 1712-345678",
    address: "House 12, Road 7, Banani, Dhaka 1213, Bangladesh",
};
export const ROUTES = {
    home: "/",
    products: "/products",
    product: (slug) => `/products/${slug}`,
    category: (slug) => `/categories/${slug}`,
    cart: "/cart",
    checkout: "/checkout",
    wishlist: "/wishlist",
    orders: "/orders",
    track: "/track",
    account: "/account",
    admin: "/admin",
    login: "/login",
    register: "/register",
};
export const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];
export const PRODUCT_STATUSES = ["draft", "active", "inactive", "out_of_stock"];
export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const BANGLADESH_DIVISIONS = [
    "Dhaka",
    "Chattogram",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
];
export const REVALIDATE = {
    products: Number(process.env.REVALIDATE_PRODUCTS ?? 60),
    category: Number(process.env.REVALIDATE_CATEGORY ?? 300),
};
