"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface HeaderContextType {
  title: string
  subtitle: string
  backUrl?: string
  setHeader: (title: string, subtitle?: string, backUrl?: string) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("Recruitment Dashboard")
  const [subtitle, setSubtitle] = useState("Manage your recruitment opportunities and candidates")
  const [backUrl, setBackUrl] = useState<string | undefined>(undefined)

  const setHeader = (newTitle: string, newSubtitle?: string, newBackUrl?: string) => {
    setTitle(newTitle)
    setSubtitle(newSubtitle || "Manage your recruitment opportunities and candidates")
    setBackUrl(newBackUrl)
  }

  return (
    <HeaderContext.Provider value={{ title, subtitle, backUrl, setHeader }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider")
  }
  return context
}

