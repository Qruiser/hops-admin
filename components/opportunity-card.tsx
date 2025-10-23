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

  return (
    <Link href={`/opportunities/${opportunity.id}`} passHref>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow h-full relative"
        onMouseDown={handleMouseDown}
        onMouseUp={() => setIsLongPressed(false)}
        onMouseLeave={() => setIsLongPressed(false)}
      >
        {opportunity.notifications > 0 && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-1 flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {opportunity.notifications}
            </Badge>
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                <Image
                  src={opportunity.companyLogo || "/placeholder.svg"}
                  alt={opportunity.company}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{opportunity.title}</h3>
                <p className="text-sm text-muted-foreground">{opportunity.company}</p>
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

          <div className="flex items-center gap-2 text-xs mt-3">
            <Badge variant="outline" className="rounded-sm">
              {opportunity.workType}
            </Badge>
            <span className="text-muted-foreground">|</span>
            <Badge variant="outline" className="rounded-sm">
              {opportunity.location}
            </Badge>
            <span className="text-muted-foreground">|</span>
            <Badge variant="outline" className="rounded-sm">
              {opportunity.employmentType}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {opportunity.status === "active" && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
            {opportunity.status === "paused" && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                <PauseCircle className="h-3 w-3 mr-1" />
                Paused
              </Badge>
            )}
            {opportunity.isHot && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                <Flame className="h-3 w-3 mr-1" />
                Hot Opportunity
              </Badge>
            )}
            {opportunity.isAging && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                <Clock className="h-3 w-3 mr-1" />
                Aging Opportunity
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-muted/50 p-2 rounded-md">
              <div className="flex items-center gap-1 text-sm">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Applications</span>
              </div>
              <p className="text-lg font-semibold">{opportunity.applications}</p>
            </div>

            <div className="bg-muted/50 p-2 rounded-md">
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Recommended</span>
              </div>
              <p className="text-lg font-semibold">{opportunity.recommended}</p>
            </div>

            <div className="bg-muted/50 p-2 rounded-md">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Shortlisted</span>
              </div>
              <p className="text-lg font-semibold">{opportunity.shortlisted}</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-right text-muted-foreground">
            Last updated: {new Date(opportunity.lastUpdated).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
