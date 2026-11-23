import api from "@/api/client.js";

const AUTH_BASE = "/api/auth";
const authData = (request) => request.then((response) => response.data);

export const signin = (payload) =>
  authData(api.post("/login", payload, { baseURL: AUTH_BASE }));
export const signup = (payload) =>
  authData(api.post("/register", payload, { baseURL: AUTH_BASE }));
export const verifyOtp = (payload) =>
  authData(api.post("/verify-email", payload, { baseURL: AUTH_BASE }));
export const verifyEmail = (token) =>
  authData(
    api.post(
      `/verify-email/${encodeURIComponent(token)}`,
      { token },
      { baseURL: AUTH_BASE },
    ),
  );
export const resendOtp = (payload) =>
  authData(api.post("/resend-otp", payload, { baseURL: AUTH_BASE }));
export const forgotPassword = (payload) =>
  authData(api.post("/forgot-password", payload, { baseURL: AUTH_BASE }));
export const resetPassword = (token, payload) =>
  authData(
    api.post(`/reset-password/${encodeURIComponent(token)}`, payload, {
      baseURL: AUTH_BASE,
    }),
  );
export const logout = () =>
  authData(api.post("/logout", undefined, { baseURL: AUTH_BASE }));
export const getSession = () =>
  authData(api.get("/session", { baseURL: AUTH_BASE }));
export const getProfile = () => authData(api.get("/users/profile"));
export const updateProfile = (formData) =>
  authData(api.put("/users/profile", formData));
export const changePassword = (payload) =>
  authData(api.put("/auth/change-password", payload));
