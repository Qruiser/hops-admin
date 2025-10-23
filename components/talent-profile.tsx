"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
  Briefcase,
  ExternalLink,
  Download,
  Award,
  Target,
  TrendingUp,
  Zap,
  DollarSign,
  Globe,
  Languages,
  Clock3,
  Building,
  BookOpen,
} from "lucide-react"
import type { Talent, TalentSource, EngagementType } from "@/types/talent"

interface TalentProfileProps {
  talent: Talent
  isOpen: boolean
  onClose: () => void
}

export function TalentProfile({ talent, isOpen, onClose }: TalentProfileProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

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
    if (!talent.preferences || typeof talent.preferences === "string" || !talent.preferences.compensation) {
      return "Not specified"
    }

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
    if (!talent.preferences || typeof talent.preferences === "string" || !talent.preferences.location) {
      return talent.location || "Location not specified"
    }

    const { location } = talent.preferences

    return `${location.remote ? "Remote" : location.country || ""}${location.city ? `, ${location.city}` : ""}${location.relocation ? " (Open to relocation)" : ""}`
  }

  // Check if preferences is the new structured format
  const hasStructuredPreferences = () => {
    return talent.preferences && typeof talent.preferences !== "string"
  }

  // Update the getAvailabilityColor function to use more vibrant colors
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500"
      case "Partially Available":
        return "bg-orange-500"
      case "Unavailable":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Calculate strength based on sources
  const calculateStrength = (sources: TalentSource[]) => {
    if (!sources || sources.length === 0) return "weak"

    // Count occurrences by source type
    const typeCounts = sources.reduce(
      (acc, source) => {
        acc[source.type] = (acc[source.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Calculate total weight
    // CV is weak, but multiple CV mentions boost strength
    // HIDI, interview, and assessment are stronger signals
    let totalWeight = 0

    // Source type weights
    const weights = {
      cv: 1,
      hidi: 3,
      interview: 4,
      assessment: 4,
      reference: 3,
      portfolio: 2,
      question: 2,
    }

    // Calculate weight with diminishing returns for repeated sources
    Object.entries(typeCounts).forEach(([type, count]) => {
      const sourceWeight = weights[type] || 1
      // Apply diminishing returns formula
      totalWeight += sourceWeight * Math.min(count, 3) * (1 - Math.exp(-count / 3))
    })

    // Determine strength based on total weight
    if (totalWeight >= 8) return "strong"
    if (totalWeight >= 4) return "medium"
    return "weak"
  }

  // Get color based on calculated strength
  const getStrengthColor = (sources: TalentSource[]) => {
    const strength = calculateStrength(sources)

    switch (strength) {
      case "strong":
        return "border-green-500 bg-green-50"
      case "medium":
        return "border-orange-400 bg-orange-50"
      case "weak":
        return "border-yellow-300 bg-yellow-50"
      default:
        return "border-slate-300 bg-slate-50"
    }
  }

  // Format source types for display
  const formatSourceTypes = (sources: TalentSource[]) => {
    const typeCounts = sources.reduce(
      (acc, source) => {
        acc[source.type] = (acc[source.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(typeCounts).map(([type, count]) => (
      <Badge key={type} variant="outline" className="text-xs capitalize">
        {type}
        {count > 1 ? ` (${count})` : ""}
      </Badge>
    ))
  }

  // Get the most recent source date
  const getLatestSourceDate = (sources: TalentSource[]) => {
    if (!sources || sources.length === 0) return null
    const dates = sources.map((source) => new Date(source.date))
    return new Date(Math.max(...dates.map((date) => date.getTime())))
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

  const { status: recencyStatus, color: recencyColor, daysAgo } = getRecencyIndicator()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={talent.photo || "/placeholder.svg"} alt={talent.name} />
                  <AvatarFallback>{getInitials(talent.name)}</AvatarFallback>
                </Avatar>
                {daysAgo <= 14 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                    <span className="sr-only">Recently active</span>
                  </div>
                )}
              </div>

              <div>
                <SheetTitle className="text-2xl">{talent.name}</SheetTitle>
                <SheetDescription className="text-base">{talent.title}</SheetDescription>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{talent.location}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${getAvailabilityColor(talent.availability.status)}`} />
                    <span className="text-sm">{talent.availability.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                CV
              </Button>
              <Button size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="talentGraph">Talent Graph</TabsTrigger>
            <TabsTrigger value="hidi">HIDI Records</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${talent.email}`} className="text-sm hover:underline">
                      {talent.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${talent.phone}`} className="text-sm hover:underline">
                      {talent.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Updated {formatDistanceToNow(new Date(talent.lastUpdated))} ago</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getAvailabilityColor(talent.availability.status)}`} />
                    <span className="text-sm font-medium">{talent.availability.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 my-1">
                    {talent.availability.engagementTypes &&
                      talent.availability.engagementTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
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
                  </div>
                  {talent.availability.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Available from {new Date(talent.availability.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {talent.availability.notice && (
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{talent.availability.notice} days notice period</span>
                    </div>
                  )}
                  <p className="text-sm">{talent.availability.details}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3" />
                    <span>Updated {formatDistanceToNow(new Date(talent.availability.lastUpdated))} ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {talent.experience &&
                    talent.experience.map((exp, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <h4 className="font-medium">
                          {exp.title} at {exp.company}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                        <p className="text-sm mt-2">{exp.description}</p>
                      </div>
                    ))}
                  {(!talent.experience || talent.experience.length === 0) && (
                    <p className="text-sm text-muted-foreground">No experience information available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Key Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills && talent.skills.length > 0 ? (
                        talent.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills listed</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Top Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatCompensation()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{getLocationDisplay()}</span>
                      </div>
                      {hasStructuredPreferences() &&
                        talent.preferences.languages &&
                        talent.preferences.languages.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Languages className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {talent.preferences.languages
                                .map((lang) => `${lang.language} (${lang.proficiency})`)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Candidate Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {hasStructuredPreferences() ? (
                  <div className="space-y-4">
                    {/* Compensation Section */}
                    {talent.preferences.compensation && (
                      <div>
                        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Compensation Expectations
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg border">
                          {talent.preferences.compensation.yearly && (
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Annual Salary:</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {talent.preferences.compensation.currency}
                                {talent.preferences.compensation.yearly.toLocaleString()}
                              </Badge>
                            </div>
                          )}

                          {talent.preferences.compensation.hourly && (
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Hourly Rate:</span>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {talent.preferences.compensation.currency}
                                {talent.preferences.compensation.hourly}/hour
                              </Badge>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Negotiable:</span>
                            <span className="text-sm">{talent.preferences.compensation.negotiable ? "Yes" : "No"}</span>
                          </div>

                          <Separator className="my-3" />

                          <div className="flex items-center justify-end text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              Updated {formatDistanceToNow(new Date(talent.preferences.compensation.lastUpdated))} ago
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location Section */}
                    {talent.preferences.location && (
                      <div>
                        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Location Preferences
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Preferred Location:</span>
                            <span className="text-sm">
                              {talent.preferences.location.country}
                              {talent.preferences.location.city && `, ${talent.preferences.location.city}`}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Remote Work:</span>
                            <Badge variant={talent.preferences.location.remote ? "default" : "outline"}>
                              {talent.preferences.location.remote ? "Yes" : "No"}
                            </Badge>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Open to Relocation:</span>
                            <Badge variant={talent.preferences.location.relocation ? "default" : "outline"}>
                              {talent.preferences.location.relocation ? "Yes" : "No"}
                            </Badge>
                          </div>

                          {talent.preferences.location.visaSponsorship !== undefined && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Needs Visa Sponsorship:</span>
                              <Badge variant={talent.preferences.location.visaSponsorship ? "default" : "outline"}>
                                {talent.preferences.location.visaSponsorship ? "Yes" : "No"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Languages Section */}
                    {talent.preferences.languages && talent.preferences.languages.length > 0 && (
                      <div>
                        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <Languages className="h-5 w-5" />
                          Language Proficiency
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg border">
                          <div className="grid grid-cols-2 gap-4">
                            {talent.preferences.languages.map((lang, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm font-medium">{lang.language}:</span>
                                <Badge
                                  variant="outline"
                                  className={
                                    lang.proficiency === "native"
                                      ? "bg-green-50 text-green-700"
                                      : lang.proficiency === "fluent"
                                        ? "bg-blue-50 text-blue-700"
                                        : lang.proficiency === "conversational"
                                          ? "bg-amber-50 text-amber-700"
                                          : "bg-slate-50 text-slate-700"
                                  }
                                >
                                  {lang.proficiency}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Work Hours Section */}
                    {talent.preferences.workHours && (
                      <div>
                        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <Clock3 className="h-5 w-5" />
                          Working Hours
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Hours per week:</span>
                            <span className="text-sm">
                              {talent.preferences.workHours.min} - {talent.preferences.workHours.max} hours
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Timezone:</span>
                            <Badge variant="outline">{talent.preferences.workHours.timezone}</Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Industry & Company Preferences */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {talent.preferences.industries && talent.preferences.industries.length > 0 && (
                        <div>
                          <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Preferred Industries
                          </h3>
                          <div className="bg-slate-50 p-4 rounded-lg border">
                            <div className="flex flex-wrap gap-2">
                              {talent.preferences.industries.map((industry, index) => (
                                <Badge key={index} variant="outline">
                                  {industry}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {talent.preferences.companySize && talent.preferences.companySize.length > 0 && (
                        <div>
                          <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Company Size
                          </h3>
                          <div className="bg-slate-50 p-4 rounded-lg border">
                            <div className="flex flex-wrap gap-2">
                              {talent.preferences.companySize.map((size, index) => (
                                <Badge key={index} variant="outline">
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Benefits */}
                    {talent.preferences.benefits && talent.preferences.benefits.length > 0 && (
                      <div>
                        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Preferred Benefits
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg border">
                          <div className="flex flex-wrap gap-2">
                            {talent.preferences.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {talent.preferences.lastUpdated && (
                      <div className="flex items-center justify-end text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          Preferences updated {formatDistanceToNow(new Date(talent.preferences.lastUpdated))} ago
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-muted-foreground">
                      This candidate is using the legacy preference format. Please update their profile to see detailed
                      preferences.
                    </p>
                    {Array.isArray(talent.preferences) && talent.preferences.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">Legacy Preferences</h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {talent.preferences.map((pref, index) => (
                            <Badge key={index} variant="outline">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="talentGraph" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Talent Graph</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Skills
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {talent.talentGraph.skills &&
                        talent.talentGraph.skills.map((skill, index) => {
                          const latestDate = getLatestSourceDate(skill.sources)
                          return (
                            <div
                              key={index}
                              className={`
                              p-4 rounded-lg border 
                              ${getStrengthColor(skill.sources)}
                            `}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{skill.name}</h4>
                                <Badge
                                  variant="outline"
                                  className={`
                                ${
                                  calculateStrength(skill.sources) === "strong"
                                    ? "bg-green-100 text-green-800"
                                    : calculateStrength(skill.sources) === "medium"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }
                              `}
                                >
                                  {calculateStrength(skill.sources) === "strong"
                                    ? "Strong"
                                    : calculateStrength(skill.sources) === "medium"
                                      ? "Medium"
                                      : "Weak"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>

                              <div className="mt-3">
                                <h5 className="text-xs font-medium mb-1">Sources:</h5>
                                <div className="flex flex-wrap gap-1 mb-2">{formatSourceTypes(skill.sources)}</div>
                              </div>

                              {latestDate && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>Last updated: {formatDistanceToNow(latestDate)} ago</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      {(!talent.talentGraph.skills || talent.talentGraph.skills.length === 0) && (
                        <p className="text-sm text-muted-foreground col-span-2">No skills information available</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Accomplishments
                    </h3>
                    <div className="space-y-3">
                      {talent.talentGraph.accomplishments &&
                        talent.talentGraph.accomplishments.map((accomplishment, index) => {
                          const latestDate = getLatestSourceDate(accomplishment.sources)
                          return (
                            <div
                              key={index}
                              className={`
                              p-4 rounded-lg border 
                              ${getStrengthColor(accomplishment.sources)}
                            `}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{accomplishment.name}</h4>
                                <Badge
                                  variant="outline"
                                  className={`
                                ${
                                  calculateStrength(accomplishment.sources) === "strong"
                                    ? "bg-green-100 text-green-800"
                                    : calculateStrength(accomplishment.sources) === "medium"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }
                              `}
                                >
                                  {calculateStrength(accomplishment.sources) === "strong"
                                    ? "Strong"
                                    : calculateStrength(accomplishment.sources) === "medium"
                                      ? "Medium"
                                      : "Weak"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{accomplishment.description}</p>

                              <div className="mt-3">
                                <h5 className="text-xs font-medium mb-1">Sources:</h5>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {formatSourceTypes(accomplishment.sources)}
                                </div>
                              </div>

                              {latestDate && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>Last updated: {formatDistanceToNow(latestDate)} ago</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      {(!talent.talentGraph.accomplishments || talent.talentGraph.accomplishments.length === 0) && (
                        <p className="text-sm text-muted-foreground">No accomplishments information available</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Objectives
                    </h3>
                    <div className="space-y-3">
                      {talent.talentGraph.objectives &&
                        talent.talentGraph.objectives.map((objective, index) => {
                          const latestDate = getLatestSourceDate(objective.sources)
                          return (
                            <div
                              key={index}
                              className={`
                              p-4 rounded-lg border 
                              ${getStrengthColor(objective.sources)}
                            `}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{objective.name}</h4>
                                <Badge
                                  variant="outline"
                                  className={`
                                ${
                                  calculateStrength(objective.sources) === "strong"
                                    ? "bg-green-100 text-green-800"
                                    : calculateStrength(objective.sources) === "medium"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }
                              `}
                                >
                                  {calculateStrength(objective.sources) === "strong"
                                    ? "Strong"
                                    : calculateStrength(objective.sources) === "medium"
                                      ? "Medium"
                                      : "Weak"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>

                              <div className="mt-3">
                                <h5 className="text-xs font-medium mb-1">Sources:</h5>
                                <div className="flex flex-wrap gap-1 mb-2">{formatSourceTypes(objective.sources)}</div>
                              </div>

                              {latestDate && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>Last updated: {formatDistanceToNow(latestDate)} ago</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      {(!talent.talentGraph.objectives || talent.talentGraph.objectives.length === 0) && (
                        <p className="text-sm text-muted-foreground">No objectives information available</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Results
                    </h3>
                    <div className="space-y-3">
                      {talent.talentGraph.results &&
                        talent.talentGraph.results.map((result, index) => {
                          const latestDate = getLatestSourceDate(result.sources)
                          return (
                            <div
                              key={index}
                              className={`
                              p-4 rounded-lg border 
                              ${getStrengthColor(result.sources)}
                            `}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{result.name}</h4>
                                <Badge
                                  variant="outline"
                                  className={`
                                ${
                                  calculateStrength(result.sources) === "strong"
                                    ? "bg-green-100 text-green-800"
                                    : calculateStrength(result.sources) === "medium"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }
                              `}
                                >
                                  {calculateStrength(result.sources) === "strong"
                                    ? "Strong"
                                    : calculateStrength(result.sources) === "medium"
                                      ? "Medium"
                                      : "Weak"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{result.description}</p>

                              <div className="mt-3">
                                <h5 className="text-xs font-medium mb-1">Sources:</h5>
                                <div className="flex flex-wrap gap-1 mb-2">{formatSourceTypes(result.sources)}</div>
                              </div>

                              {latestDate && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>Last updated: {formatDistanceToNow(latestDate)} ago</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      {(!talent.talentGraph.results || talent.talentGraph.results.length === 0) && (
                        <p className="text-sm text-muted-foreground">No results information available</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Capabilities
                    </h3>
                    <div className="space-y-3">
                      {talent.talentGraph.capabilities &&
                        talent.talentGraph.capabilities.map((capability, index) => {
                          const latestDate = getLatestSourceDate(capability.sources)
                          return (
                            <div
                              key={index}
                              className={`
                              p-4 rounded-lg border 
                              ${getStrengthColor(capability.sources)}
                            `}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{capability.name}</h4>
                                <Badge
                                  variant="outline"
                                  className={`
                                ${
                                  calculateStrength(capability.sources) === "strong"
                                    ? "bg-green-100 text-green-800"
                                    : calculateStrength(capability.sources) === "medium"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }
                              `}
                                >
                                  {calculateStrength(capability.sources) === "strong"
                                    ? "Strong"
                                    : calculateStrength(capability.sources) === "medium"
                                      ? "Medium"
                                      : "Weak"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{capability.description}</p>

                              <div className="mt-3">
                                <h5 className="text-xs font-medium mb-1">Sources:</h5>
                                <div className="flex flex-wrap gap-1 mb-2">{formatSourceTypes(capability.sources)}</div>
                              </div>

                              {latestDate && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>Last updated: {formatDistanceToNow(latestDate)} ago</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      {(!talent.talentGraph.capabilities || talent.talentGraph.capabilities.length === 0) && (
                        <p className="text-sm text-muted-foreground">No capabilities information available</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hidi" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">HIDI Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {talent.hidiRecords && talent.hidiRecords.length > 0 ? (
                    talent.hidiRecords.map((record, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{record.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm">{record.summary}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Created {formatDistanceToNow(new Date(record.createdAt))} ago
                            </span>
                            <a
                              href={record.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs flex items-center text-primary hover:underline"
                            >
                              View HIDI <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No HIDI records available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {talent.history && talent.history.length > 0 ? (
                    talent.history.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-sm">{item.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(item.timestamp))} ago
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No history available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <Button className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Job Opportunity
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
