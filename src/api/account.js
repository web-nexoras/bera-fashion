import api from "@/api/client.js";

const data = (request) => request.then((response) => response.data);

export const getProfile = () => data(api.get("/users/profile"));
export const updateProfile = (payload) => data(api.put("/users/profile", payload));
export const getAddresses = () => data(api.get("/users/addresses"));
export const saveAddress = (id, payload) => data(api[id ? "put" : "post"](id ? `/users/addresses/${id}` : "/users/addresses", payload));
export const deleteAddress = (id) => data(api.delete(`/users/addresses/${id}`));
export const getReturns = () => data(api.get("/returns/my"));
export const requestReturn = (payload) => data(api.post("/returns", payload));
export const getTransactions = () => data(api.get("/payments/my-transactions"));
export const changePassword = (payload) => data(api.put("/auth/change-password", payload));
