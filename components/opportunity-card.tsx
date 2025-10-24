"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Flame,
  Clock,
  CheckCircle2,
  PauseCircle,
  FileText,
  Users,
  Star,
  MoreVertical,
  Edit,
  Pause,
  Play,
  Archive,
  Trash2,
  Bell,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface OpportunityCardProps {
  opportunity: {
    id: string
    title: string
    company: string
    companyLogo: string
    workType: string
    location: string
    employmentType: string
    status: string
    isHot: boolean
    isAging: boolean
    applications: number
    matchPercentage: number
    recommended: number
    shortlisted: number
    lastUpdated: string
    notifications: number // New field for notifications
  }
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [isLongPressed, setIsLongPressed] = useState(false)

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsLongPressed(true)
    }, 500)

    return () => clearTimeout(timer)
  }

  // Color palette system based on opportunity characteristics
  const getCardColorPalette = () => {
    if (opportunity.isHot) {
      return {
        card: "bg-gradient-to-br from-red-50 to-orange-50 border-red-100",
        accent: "text-red-600",
        badge: "bg-red-100 text-red-700 border-red-200",
        metrics: "bg-red-50/50 border-red-100/50"
      }
    }
    if (opportunity.isAging) {
      return {
        card: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100",
        accent: "text-blue-600",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        metrics: "bg-blue-50/50 border-blue-100/50"
      }
    }
    if (opportunity.status === "active") {
      return {
        card: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100",
        accent: "text-green-600",
        badge: "bg-green-100 text-green-700 border-green-200",
        metrics: "bg-green-50/50 border-green-100/50"
      }
    }
    if (opportunity.status === "paused") {
      return {
        card: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100",
        accent: "text-amber-600",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        metrics: "bg-amber-50/50 border-amber-100/50"
      }
    }
    // Default palette
    return {
      card: "bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100",
      accent: "text-slate-600",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      metrics: "bg-slate-50/50 border-slate-100/50"
    }
  }

  const colorPalette = getCardColorPalette()

  return (
    <Link href={`/opportunities/${opportunity.id}`} passHref>
      <Card
        className={`cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 h-full relative shadow-sm ${colorPalette.card}`}
        onMouseDown={handleMouseDown}
        onMouseUp={() => setIsLongPressed(false)}
        onMouseLeave={() => setIsLongPressed(false)}
      >
        {opportunity.notifications > 0 && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
              <Bell className="h-3 w-3" />
              {opportunity.notifications}
            </Badge>
          </div>
        )}
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted/50 flex-shrink-0">
                <Image
                  src={opportunity.companyLogo || "/placeholder.svg"}
                  alt={opportunity.company}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl line-clamp-1 text-foreground mb-1">{opportunity.title}</h3>
                <p className="text-sm font-medium text-muted-foreground">{opportunity.company}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {opportunity.status === "active" ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`rounded-md px-3 py-1 text-xs font-medium ${colorPalette.badge}`}>
              {opportunity.workType}
            </Badge>
            <Badge variant="outline" className="rounded-md px-3 py-1 text-xs border-muted-foreground/20">
              {opportunity.location}
            </Badge>
            <Badge variant="outline" className="rounded-md px-3 py-1 text-xs border-muted-foreground/20">
              {opportunity.employmentType}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {opportunity.status === "active" && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-md px-2 py-1">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
            {opportunity.status === "paused" && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 rounded-md px-2 py-1">
                <PauseCircle className="h-3 w-3 mr-1" />
                Paused
              </Badge>
            )}
            {opportunity.isHot && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 rounded-md px-2 py-1">
                <Flame className="h-3 w-3 mr-1" />
                Hot
              </Badge>
            )}
            {opportunity.isAging && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-md px-2 py-1">
                <Clock className="h-3 w-3 mr-1" />
                Aging
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${colorPalette.metrics}`}>
              <div className="flex items-center gap-2 mb-2">
                <FileText className={`h-4 w-4 ${colorPalette.accent}`} />
                <span className="text-sm font-medium text-muted-foreground">Applications</span>
              </div>
              <p className={`text-2xl font-bold ${colorPalette.accent}`}>{opportunity.applications}</p>
            </div>

            <div className={`p-4 rounded-lg border ${colorPalette.metrics}`}>
              <div className="flex items-center gap-2 mb-2">
                <Users className={`h-4 w-4 ${colorPalette.accent}`} />
                <span className="text-sm font-medium text-muted-foreground">Recommended</span>
              </div>
              <p className={`text-2xl font-bold ${colorPalette.accent}`}>{opportunity.recommended}</p>
            </div>

            <div className={`p-4 rounded-lg border ${colorPalette.metrics}`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className={`h-4 w-4 ${colorPalette.accent}`} />
                <span className="text-sm font-medium text-muted-foreground">Shortlisted</span>
              </div>
              <p className={`text-2xl font-bold ${colorPalette.accent}`}>{opportunity.shortlisted}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-muted/50">
            <p className="text-xs text-muted-foreground text-right">
              Updated {new Date(opportunity.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
