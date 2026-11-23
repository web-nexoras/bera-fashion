import api from "@/api/client.js";

const data = (request) => request.then((response) => response.data);

export const getWishlist = () => data(api.get("/wishlist"));
export const addToWishlist = (productId) => data(api.post("/wishlist/items", { productId }));
export const removeFromWishlist = (productId) => data(api.delete(`/wishlist/items/${encodeURIComponent(productId)}`));
