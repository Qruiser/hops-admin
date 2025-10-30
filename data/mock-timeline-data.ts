// Mock time-series data for opportunity timeline
export interface TimelineDataPoint {
  date: string
  applications: number
  matches: number
  evaluations: number
  recommendations: number
  deployments: number
}

// Simple seeded RNG for deterministic mock data per opportunity
function createSeededRng(seed: string) {
  // xmur3 hash -> mulberry32
  function xmur3(str: string) {
    let h = 1779033703 ^ str.length
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
      h = (h << 13) | (h >>> 19)
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507)
      h = Math.imul(h ^ (h >>> 13), 3266489909)
      h ^= h >>> 16
      return h >>> 0
    }
  }
  function mulberry32(a: number) {
    return function () {
      let t = (a += 0x6d2b79f5)
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }
  const seedFn = xmur3(seed)
  return mulberry32(seedFn())
}

export const generateOpportunityTimelineData = (seed: string): TimelineDataPoint[] => {
  const data: TimelineDataPoint[] = []
  const rand = createSeededRng(seed || "default-seed")
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 60) // 60 days ago (2 months)

  // Generate data for the last 60 days
  for (let i = 0; i < 60; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    // Simulate realistic growth patterns
    const dayProgress = i / 59 // 0 to 1 (60 days total)
    
    // Applications start high and taper off
    const applications = Math.max(0, Math.floor(30 * (1 - dayProgress * 0.7) + rand() * 5))
    
    // Matches grow steadily from applications
    const matches = Math.floor(dayProgress * 15 + rand() * 2)
    
    // Evaluations grow more slowly
    const evaluations = Math.floor(dayProgress * 10 + rand() * 1)
    
    // Recommendations grow steadily
    const recommendations = Math.floor(dayProgress * 8 + rand() * 2)
    
    // Deployments start later and grow slowly
    const deployments = Math.floor(Math.max(0, (dayProgress - 0.4) * 5) + rand() * 1)

    data.push({
      date: currentDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      applications,
      matches,
      evaluations,
      recommendations,
      deployments,
    })
  }

  return data
}

export type TimelinePipelineDataPoint = {
  date: string;
  sourcing: number;
  matching: number;
  deployability: number;
  verifications: number;
  recommendation: number;
  putting: number;
  deployment: number;
};

export const generateOpportunityTimelinePipelineData = (seed: string): TimelinePipelineDataPoint[] => {
  const legacyData = generateOpportunityTimelineData(seed);
  return legacyData.map((item, idx) => ({
    date: item.date,
    sourcing: item.applications,
    matching: item.matches,
    deployability: item.evaluations,
    verifications: item.evaluations, // Use same for now
    recommendation: item.recommendations,
    putting: Math.max(0, Math.floor(idx / 10)), // Simple progression/filler
    deployment: item.deployments,
  }));
};
