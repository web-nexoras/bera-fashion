import api from "@/api/client.js";

const data = (request) => request.then((response) => response.data);

export const getMyOrders = () => data(api.get("/orders"));
export const getMyOrder = (id) => data(api.get(`/orders/my/${encodeURIComponent(id)}`));
export const cancelMyOrder = (id, payload) => data(api.post(`/orders/${encodeURIComponent(id)}/cancel`, payload));
export const trackOrder = (params) => data(api.get("/orders/track", { params }));
export const checkout = (payload) => data(api.post("/orders/checkout", payload));
