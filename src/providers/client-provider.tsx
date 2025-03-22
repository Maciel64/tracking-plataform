"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const query = new QueryClient();

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={query}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
