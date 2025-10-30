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
import { calculateMomentumFromOpportunity, getMomentumDescription } from "@/lib/momentum"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Opportunity as OpportunityType } from "@/data/mock-opportunities"

interface OpportunityCardProps {
  opportunity: OpportunityType
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [isLongPressed, setIsLongPressed] = useState(false)

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsLongPressed(true)
    }, 500)

    return () => clearTimeout(timer)
  }

  const momentum = calculateMomentumFromOpportunity({
    specCreated: opportunity.specCreated,
    firstRecommendation: opportunity.firstRecommendation ?? null,
    lastRecommendation: opportunity.lastRecommendation ?? null,
    recommendations: opportunity.recommendations ?? [],
  })

  // Get funny momentum description
  const getMomentumDescription = (momentum: number) => {
    if (momentum >= 90) return "Blazing fast"
    if (momentum >= 80) return "On fire"
    if (momentum >= 70) return "Cruising"
    if (momentum >= 60) return "Steady pace"
    if (momentum >= 50) return "Moving along"
    if (momentum >= 40) return "Slow and steady"
    if (momentum >= 30) return "Crawling"
    if (momentum >= 20) return "Snail's pace"
    if (momentum >= 10) return "No heartbeat"
    return "Flatlined"
  }

  const momentumDescription = getMomentumDescription(momentum)

  // Get momentum-based styling - minimal approach
  const getMomentumStyle = () => {
    if (momentum >= 80) {
      return {
        borderColor: "border-emerald-500",
        borderWidth: "border-2",
        glow: "shadow shadow-emerald-100/50"
      }
    } else if (momentum >= 60) {
      return {
        borderColor: "border-blue-500",
        borderWidth: "border-2",
        glow: "shadow shadow-blue-100/50"
      }
    } else if (momentum >= 40) {
      return {
        borderColor: "border-amber-500",
        borderWidth: "border-2",
        glow: "shadow shadow-amber-100/50"
      }
    } else {
      return {
        borderColor: "border-slate-300",
        borderWidth: "border",
        glow: "shadow-sm"
      }
    }
  }

  const momentumStyle = getMomentumStyle()

  // Get stage badge color
  const getStageBadgeColor = (stage?: string) => {
    switch (stage) {
      case "Hot":
        return "bg-red-100 text-red-700 border-red-200"
      case "Spec":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Lead":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "Recommended":
        return "bg-green-100 text-green-700 border-green-200"
      case "Sourcing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Awaiting Deployment":
        return "bg-teal-100 text-teal-700 border-teal-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const stageBadgeColor = getStageBadgeColor(opportunity.stage)

  // (Find and update existing mapping/labeling related to stage keys; example uses shown for demonstration)
  // If need to display badge or label for stages:
  const stageLabels: Record<string, string> = {
    sourcing: "Sourcing",
    matching: "Matching Preferences",
    deployability: "Deployability Check",
    verifications: "Verifications",
    recommendation: "Recommendation",
    putting: "Putting",
    deployment: "Deployment",
  };

  return (
    <Link href={`/opportunities/${opportunity.id}`} passHref>
      <Card
        className={`cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 h-full relative ${momentumStyle.glow}`}
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
        <CardContent className="p-6 space-y-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted/50 flex-shrink-0">
                <Image
                  src={opportunity.companyLogo || "/placeholder.svg"}
                  alt={opportunity.company}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg line-clamp-1 text-foreground mb-0.5">{opportunity.title}</h3>
                <p className="text-xs text-muted-foreground">{opportunity.company}</p>
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

          {/* Momentum - Centerpiece */}
          <div className={`p-8 rounded-lg border-2 ${momentumStyle.borderColor} ${momentumStyle.glow} bg-muted/20`}>
            <div className="text-center space-y-2">
              <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Pipeline Velocity</span>
              <p className={`text-6xl font-bold ${momentum >= 80 ? 'text-emerald-600' : momentum >= 60 ? 'text-blue-600' : momentum >= 40 ? 'text-amber-600' : 'text-slate-600'}`}>{momentum}</p>
              <p className={`text-sm font-medium ${momentum >= 80 ? 'text-emerald-600' : momentum >= 60 ? 'text-blue-600' : momentum >= 40 ? 'text-amber-600' : 'text-slate-600'}`}>{momentumDescription}</p>
            </div>
          </div>

          {/* Minimal Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Applications</p>
              <p className="text-lg font-semibold text-foreground">{opportunity.applications}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Matched</p>
              <p className="text-lg font-semibold text-foreground">{opportunity.matchPercentage}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Evaluated</p>
              <p className="text-lg font-semibold text-foreground">{opportunity.shortlisted}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Recommended</p>
              <p className="text-lg font-semibold text-foreground">{opportunity.recommended}</p>
            </div>
          </div>

          {/* Minimal Info Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>{opportunity.workType} · {opportunity.location}</span>
            {opportunity.stage && (
              <Badge variant="outline" className={`text-xs ${stageBadgeColor}`}>
                {opportunity.stage}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
