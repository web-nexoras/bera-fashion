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
        <Toaster position="top-right" closeButton toastOptions={{
            classNames: {
                toast: "!rounded-xl !border !border-brand-700 !bg-brand-950 !text-white !shadow-lift",
                title: "!font-semibold !text-white",
                description: "!text-brand-50",
                closeButton: "!border-brand-700 !bg-brand-900 !text-white hover:!bg-brand-800",
                success: "!border-brand-700 !bg-brand-950 !text-white",
                error: "!border-brand-700 !bg-brand-950 !text-white",
                info: "!border-brand-700 !bg-brand-950 !text-white",
                warning: "!border-brand-700 !bg-brand-950 !text-white",
                loading: "!border-brand-700 !bg-brand-950 !text-white",
                default: "!border-brand-700 !bg-brand-950 !text-white",
            },
        }}/>
      </AuthProvider>
    </QueryClientProvider>);
}
