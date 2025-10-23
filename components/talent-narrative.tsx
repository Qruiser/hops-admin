"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Talent, TalentSource } from "@/types/talent"

interface TalentNarrativeProps {
  talent: Talent
  compact?: boolean
}

export function TalentNarrative({ talent, compact = false }: TalentNarrativeProps) {
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

  // Get the most important items from each category
  const getTopItems = () => {
    const skills = talent.talentGraph.skills
      ? [...talent.talentGraph.skills].sort((a, b) => {
          const strengthA = calculateStrength(a.sources)
          const strengthB = calculateStrength(b.sources)
          const strengthOrder = { strong: 0, medium: 1, weak: 2 }
          return strengthOrder[strengthA] - strengthOrder[strengthB]
        })
      : []

    const accomplishments = talent.talentGraph.accomplishments
      ? [...talent.talentGraph.accomplishments].sort((a, b) => {
          const strengthA = calculateStrength(a.sources)
          const strengthB = calculateStrength(b.sources)
          const strengthOrder = { strong: 0, medium: 1, weak: 2 }
          return strengthOrder[strengthA] - strengthOrder[strengthB]
        })
      : []

    const capabilities = talent.talentGraph.capabilities
      ? [...talent.talentGraph.capabilities].sort((a, b) => {
          const strengthA = calculateStrength(a.sources)
          const strengthB = calculateStrength(b.sources)
          const strengthOrder = { strong: 0, medium: 1, weak: 2 }
          return strengthOrder[strengthA] - strengthOrder[strengthB]
        })
      : []

    return {
      skills: skills.slice(0, compact ? 3 : 5),
      accomplishments: accomplishments.slice(0, compact ? 2 : 3),
      capabilities: capabilities.slice(0, compact ? 2 : 3),
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

  // Get signal bars based on strength
  const getSignalBars = (strength: string) => {
    switch (strength) {
      case "strong":
        return (
          <div className="flex items-center gap-0.5">
            <div className="h-2 w-1 bg-green-600 rounded-sm"></div>
            <div className="h-3 w-1 bg-green-600 rounded-sm"></div>
            <div className="h-4 w-1 bg-green-600 rounded-sm"></div>
            <div className="h-5 w-1 bg-green-600 rounded-sm"></div>
            <span className="ml-1.5 text-xs text-green-600 font-medium">High confidence</span>
          </div>
        )
      case "medium":
        return (
          <div className="flex items-center gap-0.5">
            <div className="h-2 w-1 bg-orange-500 rounded-sm"></div>
            <div className="h-3 w-1 bg-orange-500 rounded-sm"></div>
            <div className="h-4 w-1 bg-orange-500 rounded-sm"></div>
            <div className="h-5 w-1 bg-gray-300 rounded-sm"></div>
            <span className="ml-1.5 text-xs text-orange-500 font-medium">Medium confidence</span>
          </div>
        )
      case "weak":
        return (
          <div className="flex items-center gap-0.5">
            <div className="h-2 w-1 bg-yellow-500 rounded-sm"></div>
            <div className="h-3 w-1 bg-yellow-500 rounded-sm"></div>
            <div className="h-4 w-1 bg-gray-300 rounded-sm"></div>
            <div className="h-5 w-1 bg-gray-300 rounded-sm"></div>
            <span className="ml-1.5 text-xs text-yellow-500 font-medium">Low confidence</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-0.5">
            <div className="h-2 w-1 bg-gray-400 rounded-sm"></div>
            <div className="h-3 w-1 bg-gray-300 rounded-sm"></div>
            <div className="h-4 w-1 bg-gray-300 rounded-sm"></div>
            <div className="h-5 w-1 bg-gray-300 rounded-sm"></div>
            <span className="ml-1.5 text-xs text-gray-500 font-medium">Unknown confidence</span>
          </div>
        )
    }
  }

  // Get text highlight class based on strength
  const getHighlightClass = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-green-50 text-green-800 px-1 rounded cursor-pointer"
      case "medium":
        return "bg-orange-50 text-orange-800 px-1 rounded cursor-pointer"
      case "weak":
        return "bg-yellow-50 text-yellow-800 px-1 rounded cursor-pointer"
      default:
        return ""
    }
  }

  const topItems = getTopItems()

  // Render a tooltip item with proper hover functionality
  const renderTooltipItem = (item: any, strength: string) => {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger className="inline-block">
            <span className={getHighlightClass(strength)}>{item.name.toLowerCase()}</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="z-50">
            <div className="p-2 max-w-xs">
              <div className="mb-2">{getSignalBars(strength)}</div>
              <div className="text-xs">{item.description}</div>
              <div className="mt-1 flex flex-wrap gap-1">{formatSourceTypes(item.sources)}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Professional Summary */}
        <div>
          <h3 className="text-sm font-medium mb-2">Professional Summary</h3>
          <div className="text-sm">
            {talent.name} is a{" "}
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="inline-block">
                  <span className={getHighlightClass("strong")}>{talent.title || "professional"}</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="z-50">
                  <div className="p-2 max-w-xs">
                    <div className="mb-2">{getSignalBars("strong")}</div>
                    <div className="text-xs">Professional title with high confidence</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
            with experience in{" "}
            {topItems.skills.length > 0 ? (
              <>
                {topItems.skills.map((skill, index) => {
                  const strength = calculateStrength(skill.sources)
                  return (
                    <span key={index}>
                      {renderTooltipItem(skill, strength)}
                      {index < topItems.skills.length - 1 ? ", " : ""}
                    </span>
                  )
                })}
              </>
            ) : (
              <span className="text-muted-foreground">various fields</span>
            )}
            .
          </div>
        </div>

        {/* Key Accomplishments */}
        {topItems.accomplishments.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Key Accomplishments</h3>
            <div className="text-sm">
              {talent.name} has demonstrated success in{" "}
              {topItems.accomplishments.map((accomplishment, index) => {
                const strength = calculateStrength(accomplishment.sources)
                return (
                  <span key={index}>
                    {renderTooltipItem(accomplishment, strength)}
                    {index < topItems.accomplishments.length - 1 ? ", " : ""}
                  </span>
                )
              })}
              .
            </div>
          </div>
        )}

        {/* Core Capabilities */}
        {topItems.capabilities.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Core Capabilities</h3>
            <div className="text-sm">
              {talent.name} excels at{" "}
              {topItems.capabilities.map((capability, index) => {
                const strength = calculateStrength(capability.sources)
                return (
                  <span key={index}>
                    {renderTooltipItem(capability, strength)}
                    {index < topItems.capabilities.length - 1 ? ", " : ""}
                  </span>
                )
              })}
              .
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
