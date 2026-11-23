import api from "@/api/client.js";

const data = (request) => request.then((response) => response.data);

export const getCart = () => data(api.get("/cart"));
export const addCartItem = (payload) => data(api.post("/cart/items", payload));
export const updateCartItem = (variantId, payload) => data(api.put(`/cart/items/${encodeURIComponent(variantId)}`, payload));
export const removeCartItem = (variantId) => data(api.delete(`/cart/items/${encodeURIComponent(variantId)}`));
export const applyCartCoupon = (code) => data(api.post("/cart/coupon", { code }));
export const removeCartCoupon = () => data(api.delete("/cart/coupon"));
export const clearCart = () => data(api.delete("/cart"));
