"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const query = new QueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={query}>{children}</QueryClientProvider>;
}

export function ClientProvider() {
  return (
    <>
      <Toaster />
    </>
  );
}
