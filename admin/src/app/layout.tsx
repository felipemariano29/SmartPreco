import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import "src/styles/globals.css"
import { Providers } from "./providers"

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
})

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
    <html lang="en" className={`${quicksand.variable} ${quicksand.className}`}>
      <body>  
          <Providers>{children}</Providers>
      </body> 
    </html>
  )
}
