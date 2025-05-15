"use client";

import { LanguageProvider } from "@/components/language-provider";
import { MswProvider } from "@/components/msw-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <MswProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <LanguageProvider>
              <Toaster richColors/>
              {children}
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </MswProvider>
    </ClerkProvider>
  );
}
