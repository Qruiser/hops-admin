"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface HeaderContextType {
  title: string
  subtitle: string
  setHeader: (title: string, subtitle?: string) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("Recruitment Dashboard")
  const [subtitle, setSubtitle] = useState("Manage your recruitment opportunities and candidates")

  const setHeader = (newTitle: string, newSubtitle?: string) => {
    setTitle(newTitle)
    setSubtitle(newSubtitle || "Manage your recruitment opportunities and candidates")
  }

  return (
    <HeaderContext.Provider value={{ title, subtitle, setHeader }}>
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

