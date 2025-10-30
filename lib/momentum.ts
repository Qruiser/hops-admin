export type OpportunityLike = {
  specCreated: string
  firstRecommendation?: string | null
  lastRecommendation?: string | null
  recommendations: string[]
}

export function calculateMomentumFromOpportunity(opportunity: OpportunityLike): number {
  const { specCreated, firstRecommendation, lastRecommendation, recommendations } = opportunity
  const now = new Date()
  const specDate = new Date(specCreated)
  const daysSinceSpec = (now.getTime() - specDate.getTime()) / (1000 * 60 * 60 * 24)

  if (!firstRecommendation || recommendations.length === 0) {
    return Math.round(Math.max(0, 20 - (daysSinceSpec * 2)))
  }

  const firstRecDate = new Date(firstRecommendation)
  const lastRecDate = new Date(lastRecommendation || firstRecommendation)

  const timeToFirstRec = (firstRecDate.getTime() - specDate.getTime()) / (1000 * 60 * 60 * 24)
  const firstRecScore = Math.max(0, 100 - (timeToFirstRec * 4))

  const recFrequency = recommendations.length / Math.max(1, daysSinceSpec) * 7
  const frequencyScore = Math.min(100, recFrequency * 20)

  const daysSinceLastRec = (now.getTime() - lastRecDate.getTime()) / (1000 * 60 * 60 * 24)
  const recencyScore = Math.max(0, 100 - (daysSinceLastRec * 10))

  const momentum = (firstRecScore * 0.4) + (frequencyScore * 0.3) + (recencyScore * 0.3)
  return Math.round(Math.max(0, Math.min(100, momentum)))
}

export function getMomentumDescription(momentum: number): string {
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

// Helper: build an OpportunityLike from pipeline timeline data
export function buildOpportunityLikeFromTimeline(points: any[]): OpportunityLike {
  if (!points.length) {
    const today = new Date().toISOString()
    return { specCreated: today, firstRecommendation: null, lastRecommendation: null, recommendations: [] }
  }

  const specCreated = points[0].date
  // Look for first nonzero at any stage
  const firstPoint = points.find(p => (p.recommendation || p.putting || p.deployment || p.verifications || p.matching || p.sourcing || 0) >= 1)

  let lastRecommendationDate: string | null = null
  for (let i = 1; i < points.length; i++) {
    // If any increase in any stage, call it a 'recommendation'
    const last = points[i - 1]
    const curr = points[i]
    if ((curr.recommendation || 0) > (last.recommendation || 0) ||
        (curr.putting || 0) > (last.putting || 0) ||
        (curr.deployment || 0) > (last.deployment || 0)) {
      lastRecommendationDate = curr.date
    }
  }

  // Use the maximum pipeline progress as recommendations
  const totalRecs = points[points.length - 1].recommendation || points[points.length - 1].putting || points[points.length - 1].deployment || points[points.length - 1].verifications || points[points.length - 1].matching || points[points.length - 1].sourcing || 0;
  const recommendations = Array.from({ length: Math.max(0, totalRecs) }, () => points[points.length - 1].date)

  return {
    specCreated,
    firstRecommendation: firstPoint ? firstPoint.date : null,
    lastRecommendation: lastRecommendationDate,
    recommendations,
  }
}


