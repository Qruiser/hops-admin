"use client"

import { SiteHeader } from "@/components/site-header"
import { useHeader } from "@/components/header-context"

export function HeaderContent() {
  const { title, subtitle } = useHeader()
  return <SiteHeader title={title} subtitle={subtitle} />
}

