export function generateMockTalent() {
  // Base mock data generation code here
  // This would create a function that generates realistic mock data for testing
  // including the new preferences structure

  const engagementTypes = [
    ["fulltime"],
    ["contract"],
    ["consulting"],
    ["fulltime", "contract"],
    ["consulting", "contract"],
    ["fulltime", "parttime"],
    ["freelance"],
  ]

  const languages = [
    { language: "English", proficiency: "native" },
    { language: "Spanish", proficiency: "fluent" },
    { language: "French", proficiency: "conversational" },
    { language: "German", proficiency: "basic" },
    { language: "Mandarin", proficiency: "basic" },
    { language: "Hindi", proficiency: "native" },
    { language: "Portuguese", proficiency: "fluent" },
  ]

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "E-commerce",
    "Manufacturing",
    "Media",
    "Telecommunications",
    "Energy",
    "Retail",
  ]

  const companySizes = ["Startup (1-10)", "Small (11-50)", "Medium (51-200)", "Large (201-1000)", "Enterprise (1000+)"]

  const benefits = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "Remote Work",
    "Flexible Hours",
    "Unlimited PTO",
    "401(k) Matching",
    "Stock Options",
    "Professional Development",
    "Gym Membership",
    "Mental Health Benefits",
  ]

  // Generate random date in the past 180 days
  const getRandomRecentDate = (maxDaysAgo = 180) => {
    const now = new Date()
    const daysAgo = Math.floor(Math.random() * maxDaysAgo)
    now.setDate(now.getDate() - daysAgo)
    return now.toISOString()
  }

  // Generate more recent dates for active profiles (7-30 days ago)
  const getRecentActiveDate = () => {
    const now = new Date()
    const daysAgo = Math.floor(Math.random() * 23) + 7 // 7-30 days ago
    now.setDate(now.getDate() - daysAgo)
    return now.toISOString()
  }

  // Generate very recent dates (0-7 days ago)
  const getVeryRecentDate = () => {
    const now = new Date()
    const daysAgo = Math.floor(Math.random() * 7) // 0-7 days ago
    now.setDate(now.getDate() - daysAgo)
    return now.toISOString()
  }

  // Calculate recency score (0-100) based on date
  const calculateRecencyScore = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (daysAgo <= 7) return Math.floor(Math.random() * 20) + 80 // 80-100
    if (daysAgo <= 30) return Math.floor(Math.random() * 30) + 50 // 50-80
    if (daysAgo <= 90) return Math.floor(Math.random() * 30) + 20 // 20-50
    return Math.floor(Math.random() * 20) // 0-20
  }

  // Sample function to generate mock data
  return {
    // Generate talent with expanded preferences
    generateTalent: (isRecent = false) => {
      const lastUpdated = isRecent ? getVeryRecentDate() : getRandomRecentDate()
      const recencyScore = calculateRecencyScore(lastUpdated)

      // Random selection of languages, 1-3 languages
      const selectedLanguages = []
      const langCount = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < langCount; i++) {
        const lang = languages[Math.floor(Math.random() * languages.length)]
        if (!selectedLanguages.some((l) => l.language === lang.language)) {
          selectedLanguages.push(lang)
        }
      }

      // Random selection of industries, 1-3 industries
      const selectedIndustries = []
      const indCount = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < indCount; i++) {
        const ind = industries[Math.floor(Math.random() * industries.length)]
        if (!selectedIndustries.includes(ind)) {
          selectedIndustries.push(ind)
        }
      }

      // Generate preferences
      return {
        id: `talent-${Math.floor(Math.random() * 10000)}`,
        name: "John Doe", // Replace with random name generation
        photo: "/avatar1.png", // Replace with random avatar
        title: "Senior Developer",
        email: "john.doe@example.com", // Replace with random email
        phone: "+1 (555) 123-4567", // Replace with random phone
        location: "San Francisco, CA", // Replace with random location
        skills: ["JavaScript", "React", "Node.js"], // Replace with random skills
        verified: Math.random() > 0.3, // 70% chance of being verified
        availability: {
          status: ["Available", "Partially Available", "Unavailable"][Math.floor(Math.random() * 3)],
          engagementTypes: engagementTypes[Math.floor(Math.random() * engagementTypes.length)],
          startDate: getRandomRecentDate(30), // Available within next 30 days
          notice: Math.floor(Math.random() * 60) + 14, // 2 weeks to 2 months notice
          details: "Available for new opportunities",
          lastUpdated: isRecent ? getVeryRecentDate() : getRandomRecentDate(45), // More recent for active profiles
        },
        preferences: {
          compensation: {
            yearly: Math.floor(Math.random() * 100000) + 90000, // $90k-$190k
            hourly: Math.floor(Math.random() * 100) + 50, // $50-$150/hr
            currency: "$", // Could be dynamic based on location
            negotiable: Math.random() > 0.5, // 50% chance of being negotiable
            lastUpdated: isRecent ? getVeryRecentDate() : getRandomRecentDate(60),
          },
          location: {
            country: "United States",
            city: "San Francisco",
            remote: Math.random() > 0.3, // 70% chance of accepting remote
            relocation: Math.random() > 0.6, // 40% chance of accepting relocation
            visaSponsorship: Math.random() > 0.7, // 30% chance of needing visa
          },
          languages: selectedLanguages,
          workHours: {
            min: 30 + Math.floor(Math.random() * 10), // 30-40
            max: 40 + Math.floor(Math.random() * 20), // 40-60
            timezone: "GMT-7",
          },
          benefits: benefits.slice(0, Math.floor(Math.random() * 5) + 2), // 2-7 random benefits
          industries: selectedIndustries,
          companySize: [companySizes[Math.floor(Math.random() * companySizes.length)]],
          lastUpdated: isRecent ? getVeryRecentDate() : getRandomRecentDate(60),
        },
        experience: [
          {
            title: "Senior Developer",
            company: "TechCorp",
            startDate: "2020-01-01",
            endDate: null, // Current job
            description: "Leading the frontend team for the company's main product.",
          },
          // More experience items...
        ],
        lastUpdated,
        talentGraph: {
          skills: [
            // Skill objects with sources...
          ],
          accomplishments: [
            // Accomplishment objects with sources...
          ],
          objectives: [
            // Objective objects with sources...
          ],
          results: [
            // Result objects with sources...
          ],
          capabilities: [
            // Capability objects with sources...
          ],
        },
        hidiRecords: [
          // HIDI record objects...
        ],
        history: [
          // History items...
        ],
        relevanceScore: Math.floor(Math.random() * 100), // 0-100 relevance score
        recencyScore, // 0-100 based on how recent the profile is
      }
    },
  }
}
