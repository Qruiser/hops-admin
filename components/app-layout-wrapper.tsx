"use client"

import { HeaderProvider } from "@/components/header-context"
import { HeaderContent } from "@/components/header-content"

interface AppLayoutWrapperProps {
  mainContent: React.ReactNode
}

export function AppLayoutWrapper({ mainContent }: AppLayoutWrapperProps) {
  return (
    <HeaderProvider>
      <HeaderContent />
      <main className="flex-1 p-6">{mainContent}</main>
    </HeaderProvider>
  )
}

