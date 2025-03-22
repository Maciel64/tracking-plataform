"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const query = new QueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={query}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}

export function ClientProvider() {
  return (
    <>
      <Toaster />
    </>
  );
}
