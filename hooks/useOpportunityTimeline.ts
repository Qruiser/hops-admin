import { generateOpportunityTimelinePipelineData, TimelinePipelineDataPoint } from "@/data/mock-timeline-data"

export function useOpportunityTimeline(opportunityId: string): TimelinePipelineDataPoint[] {
  // Centralized access: can be replaced with API logic later
  return generateOpportunityTimelinePipelineData(opportunityId)
}
