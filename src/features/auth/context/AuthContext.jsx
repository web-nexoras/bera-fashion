"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSession, logout as logoutRequest, signin, signup } from "@/api/auth.js";

/** @type {import("react").Context<any>} */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await getSession();
      setUser(response.data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getSession()
      .then((response) => {
        if (active) setUser(response.data?.user ?? null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const authenticate = useCallback(async (request) => {
    const response = await request;
    const nextUser = response.data?.user ?? null;
    if (response.success) setUser(nextUser);
    return { ok: Boolean(response.success), message: response.message, user: nextUser };
  }, []);

  const login = useCallback((email, password) => authenticate(signin({ email, password })), [authenticate]);
  const register = useCallback((input) => authenticate(signup(input)), [authenticate]);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    refresh,
    setUser,
  }), [user, isLoading, login, register, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
