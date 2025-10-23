"use client"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, MapPin, DollarSign, Languages, Globe } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TalentNarrative } from "./talent-narrative"
import type { Talent, EngagementType } from "@/types/talent"

interface TalentCardProps {
  talent: Talent
  viewMode: "grid" | "list"
  onClick: () => void
}

export function TalentCard({ talent, viewMode, onClick }: TalentCardProps) {
  // Update the formatEngagementTypes function to handle undefined values
  const formatEngagementTypes = (types?: EngagementType[]) => {
    if (!types || types.length === 0) return "Not specified"

    return types
      .map((type) => {
        switch (type) {
          case "fulltime":
            return "Full-time"
          case "contract":
            return "Contract"
          case "consulting":
            return "Consulting"
          case "parttime":
            return "Part-time"
          case "freelance":
            return "Freelance"
          default:
            return type
        }
      })
      .join(", ")
  }

  // Update the formatCompensation function to handle undefined values
  const formatCompensation = () => {
    if (!talent.preferences || !talent.preferences.compensation) return "Not specified"

    const { compensation } = talent.preferences

    const result = []

    if (compensation.yearly) {
      result.push(`${compensation.currency || "$"}${compensation.yearly.toLocaleString()}/year`)
    }

    if (compensation.hourly) {
      result.push(`${compensation.currency || "$"}${compensation.hourly}/hour`)
    }

    if (result.length === 0) {
      result.push("Not specified")
    }

    if (compensation.negotiable) {
      result.push("(negotiable)")
    }

    return result.join(" ")
  }

  // Add this function to safely get location information
  const getLocationDisplay = () => {
    if (!talent.preferences || !talent.preferences.location) {
      return talent.location || "Location not specified"
    }

    const { location } = talent.preferences

    return `${location.remote ? "Remote" : location.country || ""}${location.city ? `, ${location.city}` : ""}${location.relocation ? " (Open to relocation)" : ""}`
  }

  // Get availability color and relevance
  const getAvailabilityInfo = () => {
    const { status } = talent.availability
    let color = "bg-slate-500"
    let textColor = "text-slate-700"
    let bgColor = "bg-slate-100"
    let relevanceText = "Unknown relevance"

    switch (status) {
      case "Available":
        color = "bg-green-500"
        textColor = "text-green-700"
        bgColor = "bg-green-50"
        relevanceText =
          talent.relevanceScore && talent.relevanceScore > 80
            ? "Highly relevant"
            : talent.relevanceScore && talent.relevanceScore > 50
              ? "Moderately relevant"
              : "Low relevance"
        break
      case "Partially Available":
        color = "bg-orange-500"
        textColor = "text-orange-700"
        bgColor = "bg-orange-50"
        relevanceText =
          talent.relevanceScore && talent.relevanceScore > 70 ? "Consider for part-time" : "Limited availability"
        break
      case "Unavailable":
        color = "bg-red-500"
        textColor = "text-red-700"
        bgColor = "bg-red-50"
        relevanceText = "Not currently available"
        break
    }

    return { color, textColor, bgColor, relevanceText }
  }

  // Get recency indicator
  const getRecencyIndicator = () => {
    const lastUpdatedDate = new Date(talent.lastUpdated)
    const daysAgo = Math.floor((new Date().getTime() - lastUpdatedDate.getTime()) / (1000 * 60 * 60 * 24))

    let status = ""
    let color = ""

    if (daysAgo <= 7) {
      status = "Recently updated"
      color = "bg-green-500"
    } else if (daysAgo <= 30) {
      status = "Updated this month"
      color = "bg-blue-500"
    } else if (daysAgo <= 90) {
      status = "Updated recently"
      color = "bg-amber-500"
    } else {
      status = "Needs update"
      color = "bg-red-500"
    }

    return { status, color, daysAgo }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const {
    color: availabilityColor,
    textColor: availabilityTextColor,
    bgColor: availabilityBgColor,
    relevanceText,
  } = getAvailabilityInfo()

  const { status: recencyStatus, color: recencyColor, daysAgo } = getRecencyIndicator()

  if (viewMode === "list") {
    return (
      <TooltipProvider>
        <Card
          className={`hover:shadow-md transition-shadow cursor-pointer ${
            daysAgo <= 14 ? "border-l-4 border-l-green-500" : daysAgo <= 30 ? "border-l-4 border-l-blue-400" : ""
          }`}
          onClick={onClick}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* WHO HE IS - Left section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={talent.photo || "/placeholder.svg"} alt={talent.name} />
                    <AvatarFallback>{getInitials(talent.name)}</AvatarFallback>
                  </Avatar>
                  {daysAgo <= 14 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="h-full w-full"></div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Recently active</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <h3 className="font-semibold">{talent.name}</h3>
                  <p className="text-xs text-muted-foreground">{talent.title}</p>
                </div>
              </div>

              {/* AVAILABILITY & PREFERENCES - Middle section */}
              <div className="flex-1 border-l border-r px-4">
                <div
                  className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${availabilityBgColor} ${availabilityTextColor} text-sm mb-2`}
                >
                  <div className={`h-2 w-2 rounded-full ${availabilityColor}`} />
                  <span className="font-medium">{talent.availability.status}</span>
                </div>

                <div className="flex items-center gap-1 mt-2 text-xs">
                  <span className="font-medium text-muted-foreground">Available for:</span>
                  <div className="flex flex-wrap gap-1">
                    {talent.availability.engagementTypes &&
                      talent.availability.engagementTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type === "fulltime"
                            ? "Full-time"
                            : type === "contract"
                              ? "Contract"
                              : type === "consulting"
                                ? "Consulting"
                                : type === "parttime"
                                  ? "Part-time"
                                  : type === "freelance"
                                    ? "Freelance"
                                    : type}
                        </Badge>
                      ))}
                    {(!talent.availability.engagementTypes || talent.availability.engagementTypes.length === 0) && (
                      <span className="text-muted-foreground">Not specified</span>
                    )}
                  </div>
                </div>

                {/* Compensation */}
                <div className="flex items-center gap-1 mt-3 text-xs">
                  <DollarSign className="h-3 w-3" />
                  <span>{formatCompensation()}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span>{getLocationDisplay()}</span>
                </div>

                {/* Languages */}
                {talent.preferences?.languages && talent.preferences.languages.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <Languages className="h-3 w-3" />
                    <span>
                      {talent.preferences.languages.map((lang) => `${lang.language} (${lang.proficiency})`).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* TALENT NARRATIVE - Right section */}
              <div className="flex-1">
                <TalentNarrative talent={talent} compact={true} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-2 text-xs bg-slate-50">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated {formatDistanceToNow(new Date(talent.lastUpdated))} ago</span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${
                  daysAgo <= 7
                    ? "bg-green-100 text-green-800 border-green-200"
                    : daysAgo <= 30
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : daysAgo <= 90
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                {recencyStatus}
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col ${
          daysAgo <= 14 ? "border-t-4 border-t-green-500" : daysAgo <= 30 ? "border-t-4 border-t-blue-400" : ""
        }`}
        onClick={onClick}
      >
        <CardContent className="p-6 flex-1">
          {/* WHO HE IS - Top section */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={talent.photo || "/placeholder.svg"} alt={talent.name} />
                  <AvatarFallback>{getInitials(talent.name)}</AvatarFallback>
                </Avatar>
                {daysAgo <= 14 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="h-full w-full"></div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Recently active</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <h3 className="font-semibold">{talent.name}</h3>
                <p className="text-xs text-muted-foreground">{talent.title}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 text-xs">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{talent.location}</span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs mt-1 ${
                  daysAgo <= 7
                    ? "bg-green-100 text-green-800 border-green-200"
                    : daysAgo <= 30
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : daysAgo <= 90
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                {recencyStatus}
              </Badge>
            </div>
          </div>

          {/* AVAILABILITY & PREFERENCES - Middle section */}
          <div className="border-t border-b py-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${availabilityBgColor} ${availabilityTextColor} text-sm`}
              >
                <div className={`h-2 w-2 rounded-full ${availabilityColor}`} />
                <span className="font-medium">{talent.availability.status}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                <span>Updated {formatDistanceToNow(new Date(talent.availability.lastUpdated))} ago</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 mb-2">
              <span className="text-xs font-medium text-muted-foreground">Available for:</span>
              <div className="flex flex-wrap gap-1">
                {talent.availability.engagementTypes && talent.availability.engagementTypes.length > 0 ? (
                  talent.availability.engagementTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type === "fulltime"
                        ? "Full-time"
                        : type === "contract"
                          ? "Contract"
                          : type === "consulting"
                            ? "Consulting"
                            : type === "parttime"
                              ? "Part-time"
                              : type === "freelance"
                                ? "Freelance"
                                : type}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Not specified</span>
                )}
              </div>
            </div>

            {/* Compensation */}
            <div className="flex items-center gap-1 mt-2 text-xs">
              <DollarSign className="h-3 w-3" />
              <span>{formatCompensation()}</span>
            </div>

            {/* Location preference */}
            <div className="flex items-center gap-1 mt-2 text-xs">
              <Globe className="h-3 w-3" />
              <span>{getLocationDisplay()}</span>
            </div>
          </div>

          {/* TALENT NARRATIVE - Bottom section */}
          <div className="mt-3">
            <TalentNarrative talent={talent} compact={true} />
          </div>
        </CardContent>

        <CardFooter className="border-t p-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Profile updated {formatDistanceToNow(new Date(talent.lastUpdated))} ago</span>
            </div>

            {talent.verified && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span>Verified</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
