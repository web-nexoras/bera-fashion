/** Deterministic fallback dataset used when the Express backend is not reachable. */
export const photo = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80&crop=entropy`;
const image = (id, alt, isMain = true) => ({
    url: photo(id),
    alt,
    isMain,
});
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const daysAhead = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
/* -------------------------------------------------------------------------- */
/* Taxonomy                                                                    */
/* -------------------------------------------------------------------------- */
export const fallbackCategories = [
    {
        _id: "cat_men",
        name: "Men's Collection",
        slug: "mens-collection",
        description: "Sharp silhouettes and everyday essentials for the modern man.",
        image: photo("photo-1516257984-b1b4d707412e", 700),
        parent: null,
        isActive: true,
    },
    {
        _id: "cat_women",
        name: "Women's Collection",
        slug: "womens-collection",
        description: "Graceful staples and statement pieces, designed to be lived in.",
        image: photo("photo-1483985988355-763728e1935b", 700),
        parent: null,
        isActive: true,
    },
    {
        _id: "cat_ethnic",
        name: "Ethnic Wear",
        slug: "ethnic-wear",
        description: "Heritage-inspired craftsmanship with a contemporary finish.",
        image: photo("photo-1554568218-0f1715e72254", 700),
        parent: null,
        isActive: true,
    },
    {
        _id: "cat_outerwear",
        name: "Outerwear",
        slug: "outerwear",
        description: "Layer up with considered outerwear built for every season.",
        image: photo("photo-1591047139829-d91aecb6caea", 700),
        parent: null,
        isActive: true,
    },
    {
        _id: "cat_footwear",
        name: "Footwear",
        slug: "footwear",
        description: "Comfort-led designs that carry you through the day.",
        image: photo("photo-1549298916-b41d501d3772", 700),
        parent: null,
        isActive: true,
    },
    {
        _id: "cat_accessories",
        name: "Accessories",
        slug: "accessories",
        description: "The considered details that complete the look.",
        image: photo("photo-1584917865442-de89df76afd3", 700),
        parent: null,
        isActive: true,
    },
    {
        _id: "cat_kids",
        name: "Kids",
        slug: "kids",
        description: "Playful, soft and made for little adventurers.",
        image: photo("photo-1503454537195-1dcabb73ffb9", 700),
        parent: null,
        isActive: true,
    },
    {
        _id: "cat_new",
        name: "New Arrivals",
        slug: "new-arrivals",
        description: "The latest additions to the BERA edit.",
        image: photo("photo-1490481651871-ab68de25d43d", 700),
        parent: null,
        isActive: true,
    },
];
export const fallbackBrands = [
    { _id: "brd_bera", name: "BERA", slug: "bera", description: "Our signature line.", isActive: true },
    { _id: "brd_atelier", name: "Atelier 21", slug: "atelier-21", description: "Refined tailoring.", isActive: true },
    { _id: "brd_urban", name: "Urban Thread", slug: "urban-thread", description: "City-ready essentials.", isActive: true },
    { _id: "brd_heritage", name: "Heritage House", slug: "heritage-house", description: "Crafted traditions.", isActive: true },
    { _id: "brd_nord", name: "Nord Studio", slug: "nord-studio", description: "Minimal by design.", isActive: true },
    { _id: "brd_lumen", name: "Lumen", slug: "lumen", description: "Everyday accessories.", isActive: true },
];
const seeds = [
    { name: "Signature Cotton Oxford Shirt", category: "cat_men", brand: "brd_bera", price: 1890, compareAt: 2490, photos: ["photo-1602810318383-e386cc2a3ccf", "photo-1598033129183-c4f50c736f10"], featured: true, best: true, rating: 4.8, sold: 284 },
    { name: "Essential Heavyweight Tee", category: "cat_men", brand: "brd_urban", price: 890, compareAt: 1190, photos: ["photo-1521572163474-6864f9cf17ab", "photo-1576566588028-4147f3842f27"], best: true, rating: 4.7, sold: 512 },
    { name: "Tailored Linen Blend Trouser", category: "cat_men", brand: "brd_atelier", price: 2290, compareAt: 2990, photos: ["photo-1594633312681-425c7b97ccd1", "photo-1473966968600-fa801b869a1a"], featured: true, rating: 4.6, sold: 138 },
    { name: "Everyday Slim Fit Chino", category: "cat_men", brand: "brd_nord", price: 1990, photos: ["photo-1516826957135-700dedea698c", "photo-1541099649105-f69ad21f3246"], rating: 4.5, sold: 96 },
    { name: "Studio Knit Polo", category: "cat_men", brand: "brd_bera", price: 1490, compareAt: 1890, photos: ["photo-1521572163474-6864f9cf17ab", "photo-1503342217505-b0a15ec3261c"], fresh: true, rating: 4.4, sold: 74 },
    { name: "Textured Evening Blazer", category: "cat_men", brand: "brd_atelier", price: 6490, compareAt: 7900, photos: ["photo-1591047139829-d91aecb6caea", "photo-1507679799987-c73779587ccf"], featured: true, rating: 4.9, sold: 42 },
    { name: "Draped Midi Dress", category: "cat_women", brand: "brd_bera", price: 3290, compareAt: 4290, photos: ["photo-1595777457583-95e059d581b8", "photo-1539109136881-3be0616acf4b"], featured: true, best: true, rating: 4.9, sold: 221 },
    { name: "Soft Cotton Co-ord Set", category: "cat_women", brand: "brd_nord", price: 2790, compareAt: 3490, photos: ["photo-1515886657613-9f3515b0c78f", "photo-1490481651871-ab68de25d43d"], fresh: true, best: true, rating: 4.8, sold: 187 },
    { name: "Pleated Satin Skirt", category: "cat_women", brand: "brd_atelier", price: 2190, photos: ["photo-1583743814966-8936f5b7be1a", "photo-1483985988355-763728e1935b"], featured: true, rating: 4.6, sold: 113 },
    { name: "Relaxed Linen Shirt", category: "cat_women", brand: "brd_urban", price: 1690, compareAt: 2190, photos: ["photo-1598554747436-c9293d6a588f", "photo-1564257631407-4deb1f99d992"], rating: 4.5, sold: 164 },
    { name: "Wrap Front Jumpsuit", category: "cat_women", brand: "brd_bera", price: 3890, photos: ["photo-1544022613-e87ca75a784a", "photo-1487222477894-8943e31ef7b2"], fresh: true, rating: 4.7, sold: 88 },
    { name: "Ribbed Knit Cardigan", category: "cat_women", brand: "brd_nord", price: 2490, compareAt: 3190, photos: ["photo-1576566588028-4147f3842f27", "photo-1434389677669-e08b4cac3105"], rating: 4.6, sold: 129 },
    { name: "Embroidered Kurti Set", category: "cat_ethnic", brand: "brd_heritage", price: 3490, compareAt: 4490, photos: ["photo-1617127365659-c47fa864d8bc", "photo-1554568218-0f1715e72254"], featured: true, best: true, rating: 4.8, sold: 196 },
    { name: "Handwoven Cotton Saree", category: "cat_ethnic", brand: "brd_heritage", price: 4990, compareAt: 6500, photos: ["photo-1554568218-0f1715e72254", "photo-1610030469983-98e550d6193c"], featured: true, rating: 4.9, sold: 87 },
    { name: "Festive Anarkali Gown", category: "cat_ethnic", brand: "brd_atelier", price: 6790, photos: ["photo-1595777457583-95e059d581b8", "photo-1567188040759-fb8a883dc6d8"], fresh: true, rating: 4.7, sold: 54 },
    { name: "Printed Panjabi & Pajama", category: "cat_ethnic", brand: "brd_heritage", price: 2990, compareAt: 3690, photos: ["photo-1554568218-0f1715e72254", "photo-1602810318383-e386cc2a3ccf"], rating: 4.5, sold: 142 },
    { name: "Water-Resistant Parka", category: "cat_outerwear", brand: "brd_nord", price: 7490, compareAt: 8990, photos: ["photo-1591047139829-d91aecb6caea", "photo-1544923246-77307dd654cb"], featured: true, rating: 4.8, sold: 63 },
    { name: "Cropped Denim Jacket", category: "cat_outerwear", brand: "brd_urban", price: 3290, photos: ["photo-1543076447-215ad9ba6923", "photo-1576995853123-5a10305d93c0"], fresh: true, rating: 4.6, sold: 91 },
    { name: "Lightweight Trench Coat", category: "cat_outerwear", brand: "brd_atelier", price: 5890, compareAt: 6990, photos: ["photo-1539533018447-63fcce2678e3", "photo-1591047139829-d91aecb6caea"], rating: 4.7, sold: 48 },
    { name: "Court Leather Sneakers", category: "cat_footwear", brand: "brd_lumen", price: 3890, compareAt: 4790, photos: ["photo-1549298916-b41d501d3772", "photo-1525966222134-fcfa99b8ae77"], best: true, rating: 4.8, sold: 207 },
    { name: "Everyday Canvas Loafers", category: "cat_footwear", brand: "brd_nord", price: 2790, photos: ["photo-1614252369475-531eba835eb1", "photo-1543163521-1bf539c55dd2"], rating: 4.4, sold: 76 },
    { name: "Structured Leather Tote", category: "cat_accessories", brand: "brd_lumen", price: 4490, compareAt: 5490, photos: ["photo-1584917865442-de89df76afd3", "photo-1548036328-c9fa89d128fa"], featured: true, best: true, rating: 4.9, sold: 154 },
    { name: "Minimalist Chain Watch", category: "cat_accessories", brand: "brd_lumen", price: 3190, photos: ["photo-1523275335684-37898b6baf30", "photo-1524592094714-0f0654e20314"], fresh: true, rating: 4.6, sold: 69 },
    { name: "Woven Weekender Bag", category: "cat_accessories", brand: "brd_nord", price: 3590, compareAt: 4290, photos: ["photo-1553062407-98eeb64c6a62", "photo-1584917865442-de89df76afd3"], rating: 4.7, sold: 82 },
    { name: "Gold Vermeil Hoops", category: "cat_accessories", brand: "brd_lumen", price: 1890, photos: ["photo-1611652022419-a9419f74343d", "photo-1567188040759-fb8a883dc6d8"], rating: 4.8, sold: 118 },
    { name: "Playful Print Romper", category: "cat_kids", brand: "brd_bera", price: 1290, compareAt: 1690, photos: ["photo-1503454537195-1dcabb73ffb9", "photo-1519457431-44ccd64a579b"], fresh: true, rating: 4.7, sold: 103 },
    { name: "Cozy Fleece Hoodie", category: "cat_kids", brand: "brd_urban", price: 1490, photos: ["photo-1571945153237-4929e783af4a", "photo-1620799140408-edc6dcb6d633"], rating: 4.5, sold: 67 },
];
const sizeSets = {
    cat_footwear: ["39", "40", "41", "42", "43", "44"],
    cat_accessories: ["One Size"],
    cat_kids: ["2-4Y", "4-6Y", "6-8Y", "8-10Y"],
};
function makeVariants(seed, id) {
    const sizes = sizeSets[seed.category] ?? ["XS", "S", "M", "L", "XL"];
    const colors = seed.category === "cat_accessories"
        ? [{ name: "Maroon", code: "#7A1F3D" }]
        : [
            { name: "Maroon", code: "#7A1F3D" },
            { name: "Ivory", code: "#F4EFE8" },
            { name: "Charcoal", code: "#3A3A3A" },
        ];
    const variants = [];
    let index = 0;
    for (const color of colors) {
        for (const size of sizes) {
            if (index > 11)
                break;
            const stock = (index * 7 + (seed.sold ?? 20)) % 23;
            variants.push({
                _id: `${id}_v${index}`,
                size,
                color: color.name,
                colorCode: color.code,
                sku: `BF-${id.slice(-4).toUpperCase()}-${size.replace(/\W/g, "")}-${color.name.slice(0, 3).toUpperCase()}`,
                price: seed.price + (size === "XL" || size === "XXL" ? 150 : 0),
                regularPrice: seed.compareAt ?? seed.price + 300,
                stock,
                lowStockThreshold: 5,
                isActive: true,
            });
            index += 1;
        }
    }
    return variants;
}
export const fallbackProducts = seeds.map((seed, index) => {
    const id = `prd_${String(index + 1).padStart(3, "0")}`;
    const slug = seed.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return {
        _id: id,
        name: seed.name,
        slug,
        description: `${seed.name} from BERA. Thoughtfully designed with breathable, premium-grade materials and a considered finish. A versatile piece that moves effortlessly from everyday wear to special occasions.`,
        sku: `BF-${String(index + 1).padStart(4, "0")}`,
        category: fallbackCategories.find((category) => category._id === seed.category),
        brand: fallbackBrands.find((brand) => brand._id === seed.brand),
        images: [
            image(seed.photos[0], seed.name, true),
            ...(seed.photos[1] ? [image(seed.photos[1], `${seed.name} detail`, false)] : []),
        ],
        basePrice: seed.price,
        compareAtPrice: seed.compareAt,
        isFeatured: Boolean(seed.featured),
        isNewArrival: Boolean(seed.fresh),
        isBestSeller: Boolean(seed.best),
        status: "active",
        averageRating: seed.rating ?? 4.5,
        reviewCount: 12 + ((index * 17) % 90),
        totalSold: seed.sold ?? 40,
        tags: [seed.featured ? "featured" : "collection", seed.category.replace("cat_", "")],
        variants: makeVariants(seed, id),
        createdAt: daysAgo(index * 3 + 2),
        updatedAt: daysAgo(index + 1),
    };
});
export const findProduct = (identifier) => fallbackProducts.find((product) => product._id === identifier ||
    product.slug === identifier ||
    product.slug === identifier.toLowerCase());
/* -------------------------------------------------------------------------- */
/* Commerce                                                                    */
/* -------------------------------------------------------------------------- */
export const fallbackCoupons = [
    { _id: "cpn_save20", code: "SAVE20", type: "percentage", value: 20, minimumOrderAmount: 1500, maximumDiscount: 1200, expiresAt: daysAhead(45), usageLimit: 500, usedCount: 187, isActive: true },
    { _id: "cpn_welcome", code: "WELCOME10", type: "percentage", value: 10, minimumOrderAmount: 0, expiresAt: daysAhead(90), usageLimit: 1000, usedCount: 442, isFirstOrderOnly: true, isActive: true },
    { _id: "cpn_500off", code: "EID500", type: "fixed", value: 500, minimumOrderAmount: 3500, expiresAt: daysAhead(20), usageLimit: 200, usedCount: 96, isActive: true },
    { _id: "cpn_free", code: "FREESHIP", type: "fixed", value: 120, minimumOrderAmount: 2000, expiresAt: daysAhead(60), isActive: true },
    { _id: "cpn_old", code: "SUMMER15", type: "percentage", value: 15, minimumOrderAmount: 1000, expiresAt: daysAgo(10), isActive: false },
];
export const fallbackShippingZones = [
    { _id: "shz_dhaka", name: "Inside Dhaka", districts: ["Dhaka"], charge: 60, estimatedDays: "1-2 days", isActive: true },
    { _id: "shz_inside", name: "Outside Dhaka", districts: ["Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"], charge: 120, estimatedDays: "3-5 days", isActive: true },
    { _id: "shz_free", name: "Free Delivery", districts: ["Dhaka"], charge: 0, estimatedDays: "2-3 days", isActive: false },
];
export const fallbackAddresses = [
    { _id: "adr_1", label: "home", recipientName: "Ayesha Rahman", phone: "01712345678", addressLine1: "Flat 4B, Green View Apartment", addressLine2: "Near ESL Center", city: "Dhaka", district: "Dhaka", division: "Dhaka", postalCode: "1207", isDefault: true },
    { _id: "adr_2", label: "work", recipientName: "Ayesha Rahman", phone: "01712345678", addressLine1: "Level 8, Sky Tower", city: "Banani", district: "Dhaka", division: "Dhaka", postalCode: "1213", isDefault: false },
];
/* -------------------------------------------------------------------------- */
/* People & orders                                                             */
/* -------------------------------------------------------------------------- */
export const fallbackAdmin = {
    _id: "usr_admin",
    name: "Rahul Ahmed",
    email: "admin@berafashion.com",
    phone: "01711000000",
    role: "admin",
    isEmailVerified: true,
    isBlocked: false,
    lastLogin: daysAgo(0),
    createdAt: daysAgo(400),
};
export const fallbackCustomer = {
    _id: "usr_customer",
    name: "Ayesha Rahman",
    email: "customer@berafashion.com",
    phone: "01712345678",
    role: "customer",
    isEmailVerified: true,
    isBlocked: false,
    lastLogin: daysAgo(1),
    createdAt: daysAgo(120),
    totalOrders: 8,
    totalSpent: 28450,
};
const customerNames = [
    "Tanjina Islam", "Mohammad Yasin", "Nusrat Jahan", "Fahim Faisal",
    "Sadia Karim", "Abdullah Al Noman", "Mim Chowdhury", "Rakibul Hasan",
    "Jarin Tasnim", "Shahriar Kabir", "Moonira Akter", "Imran Hossain",
];
export const fallbackCustomers = [
    fallbackCustomer,
    ...customerNames.map((name, index) => ({
        _id: `usr_${index + 2}`,
        name,
        email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
        phone: `017${String(12000000 + index * 137).slice(0, 8)}`,
        role: "customer",
        isEmailVerified: index % 5 !== 0,
        isBlocked: index === 9,
        lastLogin: daysAgo(index + 1),
        createdAt: daysAgo(index * 11 + 5),
        totalOrders: (index * 3) % 11,
        totalSpent: ((index * 1320) % 24000) + 1200,
    })),
];
const orderStatuses = [
    "delivered", "delivered", "shipped", "processing", "confirmed",
    "pending", "delivered", "cancelled", "delivered", "shipped",
    "processing", "delivered",
];
export const fallbackOrders = orderStatuses.map((status, index) => {
    const product = fallbackProducts[(index * 2) % fallbackProducts.length];
    const variant = product.variants[index % product.variants.length] ?? product.variants[0];
    const quantity = (index % 3) + 1;
    const subtotal = variant.price * quantity;
    const discount = index % 4 === 0 ? Math.round(subtotal * 0.1) : 0;
    const shipping = index % 2 === 0 ? 60 : 120;
    const paid = status !== "pending" && status !== "cancelled" && index % 7 !== 4;
    return {
        _id: `ord_${String(index + 1).padStart(3, "0")}`,
        orderNumber: `BF-2026-${String(4831 + index * 17).toUpperCase()}`,
        user: index < 3 ? fallbackCustomer : fallbackCustomers[index % fallbackCustomers.length],
        items: [
            {
                productId: product._id,
                name: product.name,
                slug: product.slug,
                image: product.images[0].url,
                variantId: variant._id,
                size: variant.size,
                color: variant.color,
                sku: variant.sku,
                price: variant.price,
                quantity,
                subtotal,
            },
        ],
        shippingAddress: fallbackAddresses[index % 2],
        pricing: {
            subtotal,
            shippingCharge: shipping,
            discountAmount: discount,
            total: subtotal + shipping - discount,
        },
        paymentMethod: index % 3 === 0 ? "sslcommerz" : "cod",
        paymentStatus: status === "cancelled" ? "failed" : paid ? "paid" : "pending",
        orderStatus: status,
        couponCode: discount ? "SAVE10" : undefined,
        createdAt: daysAgo(index * 4 + 1),
        updatedAt: daysAgo(index * 4),
        timeline: [
            { status: "pending", at: daysAgo(index * 4 + 1) },
            ...(status !== "pending" ? [{ status: "confirmed", note: "Order confirmed", at: daysAgo(index * 4 + 1) }] : []),
            ...(["shipped", "delivered"].includes(status) ? [{ status: "shipped", note: "Handed to courier", at: daysAgo(index * 4) }] : []),
            ...(status === "delivered" ? [{ status: "delivered", note: "Delivered successfully", at: daysAgo(index * 4 - 1) }] : []),
        ],
    };
});
export const fallbackTransactions = fallbackOrders
    .filter((order) => order.paymentMethod === "sslcommerz")
    .map((order, index) => ({
    _id: `txn_${index + 1}`,
    transactionId: `SSL-${Date.now().toString().slice(-6)}${index}`,
    orderId: order._id,
    orderNumber: order.orderNumber,
    user: order.user,
    method: "sslcommerz",
    amount: order.pricing.total,
    status: order.paymentStatus,
    createdAt: order.createdAt,
}))
    .concat([
    { _id: "txn_cod", transactionId: "COD-REF", orderId: fallbackOrders[1]._id, orderNumber: fallbackOrders[1].orderNumber, user: fallbackOrders[1].user, method: "cod", amount: fallbackOrders[1].pricing.total, status: "pending", createdAt: fallbackOrders[1].createdAt },
]);
export const fallbackReturns = [
    { _id: "ret_1", returnNumber: "RET-1042", orderId: fallbackOrders[0]._id, orderNumber: fallbackOrders[0].orderNumber, user: fallbackCustomer, items: [{ name: fallbackProducts[0].name, quantity: 1, reason: "Size mismatch" }], reason: "The size was smaller than expected.", status: "requested", refundAmount: fallbackOrders[0].pricing.total, createdAt: daysAgo(2) },
    { _id: "ret_2", returnNumber: "RET-1041", orderId: fallbackOrders[4]._id, orderNumber: fallbackOrders[4].orderNumber, user: fallbackCustomers[2], items: [{ name: fallbackProducts[8].name, quantity: 1, reason: "Fabric quality" }], reason: "Fabric did not match the description.", status: "approved", refundAmount: fallbackOrders[4].pricing.total, createdAt: daysAgo(6) },
    { _id: "ret_3", returnNumber: "RET-1040", orderId: fallbackOrders[7]._id, orderNumber: fallbackOrders[7].orderNumber, user: fallbackCustomers[5], items: [{ name: fallbackProducts[3].name, quantity: 2, reason: "Changed mind" }], reason: "Ordered the wrong colour.", status: "completed", refundAmount: 3980, createdAt: daysAgo(14) },
    { _id: "ret_4", returnNumber: "RET-1039", orderId: fallbackOrders[9]._id, orderNumber: fallbackOrders[9].orderNumber, user: fallbackCustomers[7], items: [{ name: fallbackProducts[5].name, quantity: 1, reason: "Damaged item" }], reason: "Item arrived with a torn seam.", status: "rejected", refundAmount: 0, createdAt: daysAgo(21) },
];
/* -------------------------------------------------------------------------- */
/* Analytics & settings                                                        */
/* -------------------------------------------------------------------------- */
export const fallbackDashboardStats = {
    totalRevenue: 1284760,
    totalOrders: 1842,
    totalCustomers: 3274,
    totalProducts: fallbackProducts.length,
    revenueGrowth: 12.8,
    orderGrowth: 8.4,
    customerGrowth: 16.2,
    lowStockItems: 14,
    pendingOrders: 23,
    todaysRevenue: 38450,
};
export const fallbackMonthlySales = [
    { month: "Jan", revenue: 642000, orders: 128 },
    { month: "Feb", revenue: 718000, orders: 142 },
    { month: "Mar", revenue: 685000, orders: 136 },
    { month: "Apr", revenue: 892000, orders: 181 },
    { month: "May", revenue: 945000, orders: 196 },
    { month: "Jun", revenue: 812000, orders: 168 },
    { month: "Jul", revenue: 1036000, orders: 214 },
    { month: "Aug", revenue: 1148000, orders: 238 },
    { month: "Sep", revenue: 1082000, orders: 221 },
    { month: "Oct", revenue: 1245000, orders: 256 },
    { month: "Nov", revenue: 1284760, orders: 271 },
    { month: "Dec", revenue: 1392000, orders: 289 },
];
export const fallbackStoreSettings = {
    storeName: "BERA FASHION",
    tagline: "Modern elegance, made for everyday.",
    email: "support@berafashion.com",
    phone: "+880 1712-345678",
    address: "House 12, Road 7, Banani, Dhaka 1213, Bangladesh",
    currency: "BDT",
    freeShippingThreshold: 5000,
    maintenanceMode: false,
    announcements: "Free delivery on orders above ৳5,000. Use code SAVE20 for 20% off.",
};
