import type { Metadata } from "next"
import "src/styles/globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Smartpreco Admin",
  description: "Smartpreco Admin",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>  
          <Providers>{children}</Providers>
      </body> 
    </html>
  )
}
