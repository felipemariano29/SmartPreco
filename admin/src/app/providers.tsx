"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { MswProvider } from "@/components/msw-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <ClerkProvider>
      <MswProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MswProvider>
    </ClerkProvider>
  )
}
