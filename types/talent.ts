export type CandidateState =
  | "sourced"
  | "onboarded"
  | "preferenceMatched"
  | "specMatched"
  | "recommended"
  | "preferences unfit"
  | "skill unfit"

export type ProfileChangeType =
  | "profile_update"
  | "preferences_update"
  | "hidi_edited"
  | "capabilities_update"
  | "hidi_claimed"
  | "hidi_added"
  | "skills_update"
  | "experience_update"
  | "education_update"
  | "contact_info_update"

export interface ProfileChange {
  type: ProfileChangeType
  date: string
  details: string
}

// Add a new type for contact status
export type ContactStatus = "not_called" | "called" | "not_picked" | "contact_info_missing" | "not_a_fit"

export type CandidateSource = "new_candidate" | "existing_candidate" | "sourced_from_job" | "transferred_from_stage"

export interface CandidateSourceInfo {
  type: CandidateSource
  jobName?: string
  stageName?: CandidateState
  date: string
}

// Add engagement type enum
export type EngagementType = "fulltime" | "contract" | "consulting" | "parttime" | "freelance"

// Add comprehensive compensation structure
export interface CompensationExpectation {
  yearly?: number
  hourly?: number
  currency: string
  negotiable: boolean
  lastUpdated: string
}

// Add language proficiency levels
export type LanguageProficiency = "native" | "fluent" | "conversational" | "basic"

// Define language preference
export interface LanguagePreference {
  language: string
  proficiency: LanguageProficiency
}

// Define location preference
export interface LocationPreference {
  country: string
  city?: string
  remote: boolean
  relocation: boolean
  visaSponsorship?: boolean
}

// Add contactStatus field to the Candidate interface
export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  yearsOfExperience: number
  skills: string[]
  skillExperience?: Record<string, string> // Add this field to store experience level for each skill
  matchScore: number
  scoreReason: string
  matchedSkills: string[]
  matchedResults: string[]
  experience: string
  preferences: string[]
  resumeUrl: string
  verified: boolean
  state: CandidateState
  isPotentialPrincipal: boolean
  notes: string
  applyDate: string
  lastAction: {
    action: string
    by: string
    date: string
  }
  completedRound1: boolean
  contactStatus?: ContactStatus // New field for contact status

  // Status fields for each state
  sourcedDate?: string
  contactAttemptDate?: string
  contactedDate?: string
  onboardingAttemptDate?: string
  onboardedDate?: string
  preferencesCollectionDate?: string
  preferencesMatchedDate?: string
  specSentDate?: string
  specMatchedDate?: string
  recommendedDate?: string
  clientViewedDate?: string

  // Status flags
  contactAttempted?: boolean
  contactPickedUp?: boolean
  onboardingAttempted?: boolean
  preferencesCollected?: boolean
  specSent?: boolean
  awaitingRecommendation?: boolean
  clientViewed?: boolean

  // Profile changes tracking
  profileChanges?: ProfileChange[]
  lastProfileChangeDate?: string

  // Source information
  sourceInfo?: CandidateSourceInfo
}

export interface Column {
  id: CandidateState
  title: string
}

// Enhanced availability structure with engagement types
export interface Availability {
  status: "Available" | "Partially Available" | "Unavailable"
  engagementTypes?: EngagementType[] // Types of work the candidate is available for
  startDate?: string // When the candidate can start
  notice?: number // Notice period in days
  details: string
  lastUpdated: string
}

export interface Experience {
  title: string
  company: string
  startDate: string
  endDate?: string
  description: string
}

// Define source types for talent graph items
export type TalentSourceType = "cv" | "hidi" | "interview" | "assessment" | "reference" | "portfolio" | "question"

// Define a source for talent graph items
export interface TalentSource {
  type: TalentSourceType
  date: string
  details?: string
}

// Update the interfaces to include sources
export interface Skill {
  name: string
  description: string
  lastUsed: string
  sources: TalentSource[] // Multiple sources instead of single strength/source
}

export interface Accomplishment {
  name: string
  description: string
  sources: TalentSource[]
}

export interface Objective {
  name: string
  description: string
  sources: TalentSource[]
}

export interface Result {
  name: string
  description: string
  sources: TalentSource[]
}

export interface Capability {
  name: string
  description: string
  sources: TalentSource[]
}

// Enhanced candidate preferences
export interface CandidatePreferences {
  compensation?: CompensationExpectation
  location?: LocationPreference
  languages?: LanguagePreference[]
  workHours?: {
    min: number
    max: number
    timezone: string
  }
  benefits?: string[]
  industries?: string[]
  companySize?: string[]
  lastUpdated?: string
}

// Rename TalentSignals to TalentGraph
export interface TalentGraph {
  skills: Skill[]
  accomplishments: Accomplishment[]
  objectives: Objective[]
  results: Result[]
  capabilities: Capability[]
}

// Update the Talent interface to use TalentGraph instead of TalentSignals
export interface Talent {
  id: string
  name: string
  photo: string
  title: string
  email: string
  phone: string
  location: string
  skills: string[]
  verified: boolean
  availability: Availability
  preferences: string[] | CandidatePreferences // Allow both old string[] and new CandidatePreferences
  experience: Experience[]
  lastUpdated: string
  talentGraph: TalentGraph // Renamed from signals
  hidiRecords: HidiRecord[]
  history: HistoryItem[]
  relevanceScore?: number // Added relevance score for availability
  recencyScore?: number // Score from 0-100 indicating how recent and active the profile is
}

export interface HidiRecord {
  title: string
  summary: string
  url: string
  createdAt: string
}

export interface HistoryItem {
  action: string
  details: string
  timestamp: string
}
