"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/context/AuthContext.jsx";
export function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    }));
    return (<QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" richColors closeButton toastOptions={{
            classNames: {
                toast: "!rounded-xl !border-brand-100 !shadow-soft",
            },
        }}/>
      </AuthProvider>
    </QueryClientProvider>);
}
