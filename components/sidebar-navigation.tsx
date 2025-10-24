"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  BarChart,
  Briefcase,
  Settings,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Building,
  FileText,
  MessageSquare,
  SearchIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
  count?: number
}

function NavItem({ href, icon: Icon, label, active, count }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {count !== undefined && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          {count}
        </span>
      )}
    </Link>
  )
}

export function SidebarNavigation() {
  const pathname = usePathname()
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    recruitment: true,
    talent: true,
  })

  const toggleModule = (module: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }))
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-20 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">Ops Product</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Collapsible open={openModules.recruitment} onOpenChange={() => toggleModule("recruitment")}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                {openModules.recruitment ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Briefcase className="h-4 w-4" />
                <span>Recruitment</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pt-1">
              <div className="grid gap-1">
                <NavItem href="/" icon={BarChart} label="Dashboard" active={pathname === "/"} />
                <NavItem
                  href="/opportunities"
                  icon={Briefcase}
                  label="Opportunities"
                  active={pathname.startsWith("/opportunities")}
                  count={5}
                />
                <NavItem href="/clients" icon={Building} label="Clients" active={pathname.startsWith("/clients")} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openModules.talent} onOpenChange={() => toggleModule("talent")}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                {openModules.talent ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Users className="h-4 w-4" />
                <span>Talent</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pt-1">
              <div className="grid gap-1">
                <NavItem href="/talent" icon={UserCircle} label="Talent Pool" active={pathname === "/talent"} />
                <NavItem
                  href="/talent/search"
                  icon={SearchIcon}
                  label="Advanced Search"
                  active={pathname === "/talent/search"}
                />
                <NavItem
                  href="/talent/communications"
                  icon={MessageSquare}
                  label="Communications"
                  active={pathname === "/talent/communications"}
                />
                <NavItem href="/talent/hidi" icon={FileText} label="HIDIs" active={pathname === "/talent/hidi"} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="mt-6">
            <NavItem href="/settings" icon={Settings} label="Settings" active={pathname === "/settings"} />
          </div>
        </nav>
      </div>
    </div>
  )
}
