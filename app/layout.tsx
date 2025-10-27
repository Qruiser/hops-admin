import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteFooter } from "@/components/site-footer"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { AppLayoutWrapper } from "@/components/app-layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HOPS Admin",
  description: "Internal operations platform for talent management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen">
            <SidebarNavigation />
            <div className="flex flex-1 flex-col">
              <AppLayoutWrapper mainContent={children} />
              <SiteFooter />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
