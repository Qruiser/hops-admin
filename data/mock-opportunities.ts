export type Opportunity = {
  id: string
  title: string
  company: string
  companyLogo: string
  workType: string
  location: string
  employmentType: string
  status: string
  stage?: string
  isHot: boolean
  isAging: boolean
  applications: number
  matchPercentage: number
  recommended: number
  shortlisted: number
  lastUpdated: string
  notifications: number
  specCreated: string
  firstRecommendation?: string | null
  lastRecommendation?: string | null
  recommendations: string[]
  description?: string
  requirements?: string[]
  stages?: {
    sourcing: { count: number; avgTime: string }
    matching: { count: number; avgTime: string }
    deployability: { count: number; avgTime: string }
    verifications: { count: number; avgTime: string }
    recommendation: { count: number; avgTime: string }
    putting: { count: number; avgTime: string }
    deployment: { count: number; avgTime: string }
  }
}

// Helper to generate stages from old fields; Add to every exported Opportunity object
function withStages(obj: Opportunity): Opportunity {
  return {
    ...obj,
    stages: {
      sourcing: { count: obj.applications || 0, avgTime: "-" },
      matching: { count: Math.round((obj.applications || 0) * 0.6), avgTime: "-" },
      deployability: { count: Math.round((obj.matchPercentage || 0) * 0.1), avgTime: "-" },
      verifications: { count: (obj.shortlisted || 0), avgTime: "-" },
      recommendation: { count: (obj.recommended || 0), avgTime: "-" },
      putting: { count: (obj.shortlisted || 0), avgTime: "-" },
      deployment: { count: (obj.shortlisted || 0), avgTime: "-" },
    },
  }
}

export const opportunities: Opportunity[] = [
  withStages({
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    companyLogo: "/placeholder.svg?height=40&width=40",
    workType: "Remote",
    location: "United States",
    employmentType: "Full-time",
    status: "active",
    stage: "Hot",
    isHot: true,
    isAging: false,
    applications: 24,
    matchPercentage: 85,
    recommended: 6,
    shortlisted: 3,
    lastUpdated: "2023-05-15",
    notifications: 5,
    specCreated: "2023-04-01",
    firstRecommendation: "2023-04-05",
    lastRecommendation: "2023-05-12",
    recommendations: ["2023-04-05", "2023-04-08", "2023-04-15", "2023-04-22", "2023-05-01", "2023-05-12"],
    description:
      "We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have experience with React, TypeScript, and modern frontend development practices.",
    requirements: [
      "5+ years of experience in frontend development",
      "Strong knowledge of React and TypeScript",
      "Experience with state management libraries",
      "Understanding of responsive design principles",
      "Experience with testing frameworks",
    ],
  }),
  withStages({
    id: "2",
    title: "Product Manager",
    company: "FinanceHub",
    companyLogo: "/placeholder.svg?height=40&width=40",
    workType: "Hybrid",
    location: "New York, NY",
    employmentType: "Full-time",
    status: "active",
    stage: "Sourcing",
    isHot: false,
    isAging: true,
    applications: 18,
    matchPercentage: 72,
    recommended: 4,
    shortlisted: 1,
    lastUpdated: "2023-04-28",
    notifications: 2,
    specCreated: "2023-03-15",
    firstRecommendation: "2023-04-10",
    lastRecommendation: "2023-04-25",
    recommendations: ["2023-04-10", "2023-04-15", "2023-04-20", "2023-04-25"],
    description:
      "We are seeking a Product Manager to lead cross-functional teams and drive product strategy.",
    requirements: [
      "3+ years of product management experience",
      "Experience with agile methodologies",
      "Excellent communication and stakeholder management",
    ],
  }),
  withStages({
    id: "3",
    title: "DevOps Engineer",
    company: "CloudTech",
    companyLogo: "/placeholder.svg?height=40&width=40",
    workType: "On-site",
    location: "San Francisco, CA",
    employmentType: "Contract",
    status: "paused",
    stage: "Spec",
    isHot: false,
    isAging: false,
    applications: 12,
    matchPercentage: 90,
    recommended: 3,
    shortlisted: 2,
    lastUpdated: "2023-05-10",
    notifications: 0,
    specCreated: "2023-04-20",
    firstRecommendation: "2023-05-01",
    lastRecommendation: "2023-05-08",
    recommendations: ["2023-05-01", "2023-05-05", "2023-05-08"],
    description:
      "Join our platform team to build CI/CD pipelines and improve developer experience.",
    requirements: [
      "Kubernetes and Docker expertise",
      "Experience with cloud providers",
      "Infrastructure as Code (Terraform, Pulumi)",
    ],
  }),
  withStages({
    id: "4",
    title: "UX Designer",
    company: "CreativeStudio",
    companyLogo: "/placeholder.svg?height=40&width=40",
    workType: "Remote",
    location: "Anywhere",
    employmentType: "Full-time",
    status: "active",
    stage: "Recommended",
    isHot: true,
    isAging: false,
    applications: 32,
    matchPercentage: 78,
    recommended: 8,
    shortlisted: 4,
    lastUpdated: "2023-05-12",
    notifications: 3,
    specCreated: "2023-03-01",
    firstRecommendation: "2023-03-03",
    lastRecommendation: "2023-05-10",
    recommendations: ["2023-03-03", "2023-03-08", "2023-03-15", "2023-03-22", "2023-04-01", "2023-04-10", "2023-04-20", "2023-05-10"],
    description:
      "Looking for a UX Designer to craft intuitive experiences across web and mobile.",
    requirements: [
      "Strong portfolio of design projects",
      "Proficiency with Figma/Sketch",
      "User research and testing experience",
    ],
  }),
  withStages({
    id: "5",
    title: "Data Scientist",
    company: "AnalyticsPro",
    companyLogo: "/placeholder.svg?height=40&width=40",
    workType: "Hybrid",
    location: "Boston, MA",
    employmentType: "Full-time",
    status: "active",
    stage: "Lead",
    isHot: false,
    isAging: true,
    applications: 15,
    matchPercentage: 82,
    recommended: 5,
    shortlisted: 1,
    lastUpdated: "2023-04-25",
    notifications: 0,
    specCreated: "2023-02-15",
    firstRecommendation: "2023-03-01",
    lastRecommendation: "2023-04-15",
    recommendations: ["2023-03-01", "2023-03-10", "2023-03-20", "2023-04-01", "2023-04-15"],
    description:
      "We need a Data Scientist to build predictive models and drive insights.",
    requirements: [
      "Strong statistics and ML fundamentals",
      "Python, pandas, scikit-learn",
      "Experience deploying models",
    ],
  }),
  withStages({
    id: "6",
    title: "Senior Backend Engineer",
    company: "TechStartup",
    companyLogo: "/placeholder.svg?height=40&width=40",
    workType: "Remote",
    location: "United States",
    employmentType: "Full-time",
    status: "active",
    stage: "Awaiting Deployment",
    isHot: true,
    isAging: false,
    applications: 45,
    matchPercentage: 92,
    recommended: 12,
    shortlisted: 8,
    lastUpdated: "2023-05-14",
    notifications: 7,
    specCreated: "2023-03-20",
    firstRecommendation: "2023-03-22",
    lastRecommendation: "2023-05-12",
    recommendations: [
      "2023-03-22",
      "2023-03-25",
      "2023-03-30",
      "2023-04-05",
      "2023-04-10",
      "2023-04-15",
      "2023-04-20",
      "2023-04-25",
      "2023-05-01",
      "2023-05-05",
      "2023-05-08",
      "2023-05-12",
    ],
    description:
      "Build scalable backend services and APIs powering our core product.",
    requirements: [
      "5+ years backend development",
      "Node.js/TypeScript or Go",
      "SQL and NoSQL databases",
    ],
  }),
  withStages({
    id: "7",
    title: "Head of Engineering",
    company: "ScaleUp",
    companyLogo: "/placeholder.svg?height=40&width=40",
    workType: "Hybrid",
    location: "San Francisco, CA",
    employmentType: "Full-time",
    status: "active",
    stage: "Hot",
    isHot: true,
    isAging: false,
    applications: 38,
    matchPercentage: 88,
    recommended: 9,
    shortlisted: 5,
    lastUpdated: "2023-05-13",
    notifications: 6,
    specCreated: "2023-04-05",
    firstRecommendation: "2023-04-08",
    lastRecommendation: "2023-05-10",
    recommendations: [
      "2023-04-08",
      "2023-04-12",
      "2023-04-18",
      "2023-04-25",
      "2023-05-01",
      "2023-05-05",
      "2023-05-08",
      "2023-05-10",
    ],
    description:
      "Lead engineering teams, set technical strategy, and scale our platform.",
    requirements: [
      "Leadership experience",
      "Hiring and org design",
      "Architectural decision-making",
    ],
  }),
  withStages({
    id: "8",
    title: "Legacy System Maintainer",
    company: "OldTech Corp",
    companyLogo: "/placeholder.svg?height=40&width=40",
    workType: "On-site",
    location: "Detroit, MI",
    employmentType: "Full-time",
    status: "active",
    stage: "Sourcing",
    isHot: false,
    isAging: true,
    applications: 3,
    matchPercentage: 25,
    recommended: 0,
    shortlisted: 0,
    lastUpdated: "2023-03-15",
    notifications: 0,
    specCreated: "2023-01-15",
    firstRecommendation: null,
    lastRecommendation: null,
    recommendations: [],
    description:
      "Maintain and gradually modernize legacy systems critical to operations.",
    requirements: [
      "Experience with legacy stacks",
      "Patience and methodical debugging",
      "Clear documentation skills",
    ],
  }),
]

export function getOpportunityById(id: string): Opportunity | undefined {
  return opportunities.find((o) => o.id === id)
}


