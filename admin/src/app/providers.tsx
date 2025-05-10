"use client";

import { MswProvider } from "@/components/msw-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <MswProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors/>
          {children}
        </QueryClientProvider>
      </MswProvider>
    </ClerkProvider>
  );
}
