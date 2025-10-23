import type { Talent } from "@/types/talent"

export const mockTalentData: Talent[] = [
  {
    id: "1",
    name: "Alex Johnson",
    photo: "/diverse-group.png",
    title: "Senior Full Stack Developer",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "TypeScript", "GraphQL", "AWS"],
    verified: true,
    availability: {
      status: "Available",
      details: "Available for full-time roles starting next month",
      lastUpdated: "2023-04-15T10:30:00Z",
    },
    relevanceScore: 85,
    preferences: ["Remote", "Enterprise", "Team Lead"],
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Innovations Inc.",
        startDate: "2020-03-01",
        description: "Led development of cloud-based solutions",
      },
      {
        title: "Full Stack Developer",
        company: "Digital Solutions LLC",
        startDate: "2017-06-01",
        endDate: "2020-02-28",
        description: "Developed and maintained web applications",
      },
    ],
    lastUpdated: "2023-04-20T14:45:00Z",
    talentGraph: {
      skills: [
        {
          name: "React",
          description: "5+ years of experience with React, built multiple production applications",
          lastUsed: "2023-04-01",
          sources: [
            { type: "cv", date: "2023-01-15", details: "Listed as primary skill" },
            { type: "cv", date: "2023-01-15", details: "Mentioned in work experience" },
            { type: "cv", date: "2023-01-15", details: "Listed in projects section" },
            { type: "hidi", date: "2023-02-10", details: "Demonstrated in HIDI record" },
            { type: "portfolio", date: "2023-03-05", details: "Multiple React projects in portfolio" },
          ],
        },
        {
          name: "GraphQL",
          description: "3 years of experience implementing GraphQL APIs",
          lastUsed: "2023-03-15",
          sources: [
            { type: "cv", date: "2023-01-15", details: "Listed as skill" },
            { type: "hidi", date: "2023-02-10", details: "Mentioned in HIDI record" },
          ],
        },
        {
          name: "AWS Lambda",
          description: "Used AWS Lambda for serverless functions",
          lastUsed: "2022-11-10",
          sources: [{ type: "cv", date: "2023-01-15", details: "Mentioned in work experience" }],
        },
      ],
      accomplishments: [
        {
          name: "Reduced API response time by 40%",
          description: "Optimized database queries and implemented caching",
          sources: [
            { type: "cv", date: "2023-01-15", details: "Listed in achievements" },
            { type: "interview", date: "2023-03-20", details: "Discussed during technical interview" },
          ],
        },
        {
          name: "Led team of 5 developers",
          description: "Managed sprint planning and code reviews",
          sources: [{ type: "cv", date: "2023-01-15", details: "Mentioned in work experience" }],
        },
      ],
      objectives: [
        {
          name: "Architect scalable systems",
          description: "Design and implement systems that can handle high traffic",
          sources: [
            { type: "interview", date: "2023-03-20", details: "Expressed interest during interview" },
            { type: "question", date: "2023-03-25", details: "Mentioned in career goals question" },
          ],
        },
        {
          name: "Improve developer experience",
          description: "Create tools and processes to improve developer productivity",
          sources: [{ type: "question", date: "2023-03-25", details: "Mentioned in career goals question" }],
        },
      ],
      results: [
        {
          name: "Increased user engagement by 25%",
          description: "Improved UI/UX and application performance",
          sources: [
            { type: "cv", date: "2023-01-15", details: "Listed in achievements" },
            { type: "hidi", date: "2023-02-10", details: "Detailed in HIDI record" },
            { type: "interview", date: "2023-03-20", details: "Discussed during technical interview" },
          ],
        },
        {
          name: "Reduced infrastructure costs by 30%",
          description: "Optimized cloud resources and implemented auto-scaling",
          sources: [{ type: "cv", date: "2023-01-15", details: "Mentioned in work experience" }],
        },
      ],
      capabilities: [
        {
          name: "Full-stack application development",
          description: "Can build complete applications from frontend to backend",
          sources: [
            { type: "cv", date: "2023-01-15", details: "Evident from work history" },
            { type: "portfolio", date: "2023-03-05", details: "Demonstrated in portfolio projects" },
            { type: "assessment", date: "2023-03-15", details: "Confirmed in technical assessment" },
          ],
        },
        {
          name: "Technical leadership",
          description: "Can lead technical teams and make architectural decisions",
          sources: [
            { type: "cv", date: "2023-01-15", details: "Mentioned in work experience" },
            { type: "reference", date: "2023-04-01", details: "Confirmed by previous manager" },
          ],
        },
        {
          name: "DevOps",
          description: "Experience with CI/CD pipelines and infrastructure as code",
          sources: [{ type: "cv", date: "2023-01-15", details: "Mentioned in skills section" }],
        },
      ],
    },
    hidiRecords: [
      {
        title: "Building a Scalable E-commerce Platform",
        summary: "How I designed and implemented a scalable e-commerce platform using microservices",
        url: "https://app.qrusible.com/hidi/62c708d0-56a9-4f66-83df-edfefe34f6d4/1fb801fb-a907-42b7-88c9-43d99b7d5da8",
        createdAt: "2023-02-10T09:15:00Z",
      },
    ],
    history: [
      {
        action: "Profile Updated",
        details: "Updated skills and experience",
        timestamp: "2023-04-20T14:45:00Z",
      },
      {
        action: "HIDI Added",
        details: "Added new HIDI record",
        timestamp: "2023-02-10T09:15:00Z",
      },
    ],
  },
  {
    id: "2",
    name: "Sarah Chen",
    photo: "/diverse-woman-portrait.png",
    title: "Product Manager",
    email: "sarah.chen@example.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    skills: ["Product Strategy", "User Research", "Agile", "Roadmapping", "Data Analysis", "UX Design"],
    verified: true,
    availability: {
      status: "Partially Available",
      details: "Available for part-time consulting or advisory roles",
      lastUpdated: "2023-04-15T11:20:00Z",
    },
    relevanceScore: 78,
    preferences: [
      "Fintech or healthcare industries",
      "Hybrid work arrangement",
      "Growth-stage startups",
      "Strong engineering culture",
    ],
    experience: [
      {
        title: "Senior Product Manager",
        company: "FinanceApp",
        startDate: "Jun 2019",
        endDate: "Present",
        description: "Leading product strategy for a fintech platform with $10M ARR and 200,000 monthly active users.",
      },
      {
        title: "Product Manager",
        company: "HealthTech",
        startDate: "Aug 2016",
        endDate: "May 2019",
        description: "Managed the development of patient-facing mobile applications.",
      },
    ],
    lastUpdated: "2023-04-15T11:20:00Z",
    talentGraph: {
      skills: [
        {
          name: "Product Strategy",
          description: "Expert level with 7+ years of experience",
          lastUsed: "2023-04-10T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Listed as primary skill" },
            { type: "cv", date: "2023-02-10", details: "Evident in work history" },
            { type: "interview", date: "2023-03-15", details: "Demonstrated during product discussion" },
            { type: "assessment", date: "2023-03-20", details: "Scored highly on product strategy assessment" },
          ],
        },
        {
          name: "User Research",
          description: "Advanced level with 5+ years of experience",
          lastUsed: "2023-03-25T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Listed as skill" },
            { type: "hidi", date: "2023-03-20", details: "Detailed research methodology in HIDI" },
            { type: "portfolio", date: "2023-02-15", details: "User research case studies in portfolio" },
          ],
        },
        {
          name: "Agile",
          description: "Expert level with 6+ years of experience",
          lastUsed: "2023-04-12T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Listed as skill" },
            { type: "cv", date: "2023-02-10", details: "Mentioned in work experience" },
          ],
        },
        {
          name: "Data Analysis",
          description: "Advanced level with 5+ years of experience",
          lastUsed: "2023-04-05T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Listed as skill" },
            { type: "portfolio", date: "2023-02-15", details: "Data analysis examples in portfolio" },
          ],
        },
      ],
      accomplishments: [
        {
          name: "Launched new payment platform",
          description: "Led cross-functional team to launch a new payment platform that increased revenue by 35%",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Listed in achievements" },
            { type: "hidi", date: "2023-03-20", details: "Detailed in HIDI record" },
            { type: "interview", date: "2023-03-15", details: "Discussed during interview" },
          ],
        },
        {
          name: "Redesigned onboarding flow",
          description: "Improved conversion rate by 25% through data-driven UX improvements",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Listed in achievements" },
            { type: "portfolio", date: "2023-02-15", details: "Case study in portfolio" },
          ],
        },
      ],
      objectives: [
        {
          name: "Drive user acquisition",
          description: "Develop strategies to increase user base by 50% YoY",
          sources: [
            { type: "interview", date: "2023-03-15", details: "Expressed as career goal" },
            { type: "question", date: "2023-03-18", details: "Mentioned in follow-up questionnaire" },
          ],
        },
        {
          name: "Improve retention metrics",
          description: "Focus on features that increase user engagement and retention",
          sources: [
            { type: "interview", date: "2023-03-15", details: "Discussed as area of interest" },
            { type: "hidi", date: "2023-03-20", details: "Focus of HIDI record" },
          ],
        },
      ],
      results: [
        {
          name: "Increased user retention by 30%",
          description: "Through targeted feature development and UX improvements",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Listed in achievements" },
            { type: "hidi", date: "2023-03-20", details: "Detailed in HIDI record" },
            { type: "reference", date: "2023-04-05", details: "Confirmed by previous manager" },
          ],
        },
        {
          name: "Reduced churn by 20%",
          description: "By implementing customer feedback loops and addressing pain points",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Listed in achievements" },
            { type: "interview", date: "2023-03-15", details: "Explained methodology during interview" },
          ],
        },
      ],
      capabilities: [
        {
          name: "Product Management",
          description: "Expert in product strategy, roadmapping, and execution",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Evident from work history" },
            { type: "assessment", date: "2023-03-20", details: "Confirmed in product management assessment" },
            { type: "reference", date: "2023-04-05", details: "Strong recommendation from previous manager" },
          ],
        },
        {
          name: "User Experience",
          description: "Deep understanding of user-centered design principles",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Mentioned in skills" },
            { type: "portfolio", date: "2023-02-15", details: "Demonstrated in case studies" },
          ],
        },
        {
          name: "Data Analysis",
          description: "Proficient in using data to drive product decisions",
          sources: [
            { type: "cv", date: "2023-02-10", details: "Listed in skills" },
            { type: "portfolio", date: "2023-02-15", details: "Examples in portfolio" },
          ],
        },
      ],
    },
    hidiRecords: [
      {
        title: "How I Increased User Retention by 30% in 6 Months",
        summary: "A detailed case study of the strategies and tactics I used to significantly improve user retention",
        url: "https://app.qrusible.com/hidi/83e819f2-78cb-6g88-05fg-gfgfgf56h8f6/3hd023hd-c029-64d9-00eb-65fbbd9f7fc0",
        createdAt: "2023-03-20T13:30:00Z",
      },
    ],
    history: [
      {
        action: "Profile Updated",
        details: "Updated availability and preferences",
        timestamp: "2023-04-15T11:20:00Z",
      },
      {
        action: "HIDI Added",
        details: "Added new HIDI record: How I Increased User Retention by 30% in 6 Months",
        timestamp: "2023-03-20T13:30:00Z",
      },
    ],
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    photo: "/thoughtful-man.png",
    title: "DevOps Engineer",
    email: "michael.rodriguez@example.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX (Remote)",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Python", "Linux"],
    verified: true,
    availability: {
      status: "Unavailable",
      details: "Not currently looking for new opportunities",
      lastUpdated: "2023-03-10T09:45:00Z",
    },
    relevanceScore: 65,
    preferences: [
      "Remote work only",
      "Tech or e-commerce industries",
      "Companies with strong DevOps culture",
      "Competitive compensation",
    ],
    experience: [
      {
        title: "Senior DevOps Engineer",
        company: "CloudTech",
        startDate: "Apr 2018",
        endDate: "Present",
        description: "Managing cloud infrastructure and CI/CD pipelines for a SaaS platform with 99.99% uptime.",
      },
      {
        title: "Systems Administrator",
        company: "TechSolutions",
        startDate: "Jan 2015",
        endDate: "Mar 2018",
        description: "Managed on-premise and cloud infrastructure for a mid-sized tech company.",
      },
    ],
    lastUpdated: "2023-03-10T09:45:00Z",
    talentGraph: {
      skills: [
        {
          name: "AWS",
          description: "Expert level with 6+ years of experience",
          lastUsed: "2023-03-05T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Listed as primary skill" },
            { type: "cv", date: "2023-01-10", details: "Mentioned throughout work experience" },
            { type: "hidi", date: "2023-01-05", details: "Focus of HIDI record" },
            { type: "assessment", date: "2023-02-15", details: "AWS certification verified" },
          ],
        },
        {
          name: "Kubernetes",
          description: "Advanced level with 4+ years of experience",
          lastUsed: "2023-03-08T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Listed as skill" },
            { type: "hidi", date: "2023-01-05", details: "Detailed in HIDI record" },
            { type: "hidi", date: "2022-11-12", details: "Focus of GitOps HIDI" },
          ],
        },
        {
          name: "Terraform",
          description: "Expert level with 5+ years of experience",
          lastUsed: "2023-03-01T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Listed as skill" },
            { type: "cv", date: "2023-01-10", details: "Mentioned in work experience" },
          ],
        },
        {
          name: "CI/CD",
          description: "Expert level with 6+ years of experience",
          lastUsed: "2023-03-07T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Listed as skill" },
            { type: "cv", date: "2023-01-10", details: "Mentioned in work experience" },
            { type: "hidi", date: "2022-11-12", details: "Detailed in GitOps HIDI" },
          ],
        },
      ],
      accomplishments: [
        {
          name: "Reduced infrastructure costs by 40%",
          description: "Implemented auto-scaling and spot instances to optimize cloud resource usage",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Listed in achievements" },
            { type: "interview", date: "2023-02-20", details: "Explained methodology during interview" },
          ],
        },
        {
          name: "Improved deployment frequency",
          description: "Increased deployment frequency from once a week to multiple times per day",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Listed in achievements" },
            { type: "hidi", date: "2022-11-12", details: "Detailed in GitOps HIDI" },
          ],
        },
      ],
      objectives: [
        {
          name: "Implement zero-downtime deployments",
          description: "Ensure continuous service availability during updates",
          sources: [{ type: "interview", date: "2023-02-20", details: "Mentioned as area of interest" }],
        },
        {
          name: "Enhance security posture",
          description: "Implement security best practices across the infrastructure",
          sources: [
            { type: "interview", date: "2023-02-20", details: "Discussed as priority" },
            { type: "question", date: "2023-02-25", details: "Mentioned in follow-up questionnaire" },
          ],
        },
      ],
      results: [
        {
          name: "Achieved 99.99% uptime",
          description: "Through robust infrastructure design and monitoring",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Listed in achievements" },
            { type: "reference", date: "2023-03-01", details: "Confirmed by previous manager" },
          ],
        },
        {
          name: "Reduced deployment time by 70%",
          description: "By optimizing CI/CD pipelines and automating manual processes",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Listed in achievements" },
            { type: "hidi", date: "2022-11-12", details: "Detailed in GitOps HIDI" },
          ],
        },
      ],
      capabilities: [
        {
          name: "Cloud Infrastructure Management",
          description: "Expert in managing cloud infrastructure on AWS",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Evident from work history" },
            { type: "assessment", date: "2023-02-15", details: "AWS certification verified" },
            { type: "hidi", date: "2023-01-05", details: "Demonstrated in HIDI record" },
          ],
        },
        {
          name: "Automation",
          description: "Proficient in automating infrastructure and deployment processes",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Mentioned throughout work experience" },
            { type: "hidi", date: "2022-11-12", details: "Focus of GitOps HIDI" },
          ],
        },
        {
          name: "Security",
          description: "Deep understanding of security best practices for cloud environments",
          sources: [
            { type: "cv", date: "2023-01-10", details: "Mentioned in skills" },
            { type: "interview", date: "2023-02-20", details: "Demonstrated knowledge during interview" },
          ],
        },
      ],
    },
    hidiRecords: [
      {
        title: "Building a Scalable Kubernetes Infrastructure on AWS",
        summary: "A comprehensive guide to setting up and managing a production-grade Kubernetes cluster on AWS",
        url: "https://app.qrusible.com/hidi/94f920g3-89dc-7h99-16gh-hghghg67i9g7/4ie134ie-d130-75e0-11fc-76gcce0g8gd1",
        createdAt: "2023-01-05T16:40:00Z",
      },
      {
        title: "Implementing GitOps with ArgoCD",
        summary: "How I implemented GitOps principles using ArgoCD to manage Kubernetes deployments",
        url: "https://app.qrusible.com/hidi/05g031h4-90ed-8i00-27hi-ijijij78j0h8/5jf245jf-e241-86f1-22gd-87hddf1h9he2",
        createdAt: "2022-11-12T14:20:00Z",
      },
    ],
    history: [
      {
        action: "Availability Updated",
        details: "Changed availability status to Unavailable",
        timestamp: "2023-03-10T09:45:00Z",
      },
      {
        action: "HIDI Added",
        details: "Added new HIDI record: Building a Scalable Kubernetes Infrastructure on AWS",
        timestamp: "2023-01-05T16:40:00Z",
      },
    ],
  },
  {
    id: "4",
    name: "Emily Taylor",
    photo: "/diverse-woman-portrait.png",
    title: "UX/UI Designer",
    email: "emily.taylor@example.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA (Hybrid)",
    skills: ["UI Design", "User Research", "Figma", "Adobe XD", "Prototyping", "Design Systems", "Accessibility"],
    verified: true,
    availability: {
      status: "Available",
      details: "Looking for full-time UX/UI design roles",
      lastUpdated: "2023-04-30T16:15:00Z",
    },
    relevanceScore: 92,
    preferences: [
      "Tech or creative industries",
      "Hybrid work arrangement",
      "Companies with design-focused culture",
      "Opportunities for growth",
    ],
    experience: [
      {
        title: "Senior UX Designer",
        company: "DesignStudio",
        startDate: "Sep 2019",
        endDate: "Present",
        description:
          "Leading UX design for enterprise clients, focusing on creating intuitive and accessible interfaces.",
      },
      {
        title: "UI Designer",
        company: "CreativeTech",
        startDate: "May 2016",
        endDate: "Aug 2019",
        description: "Designed user interfaces for web and mobile applications.",
      },
    ],
    lastUpdated: "2023-04-30T16:15:00Z",
    talentGraph: {
      skills: [
        {
          name: "UI Design",
          description: "Expert level with 7+ years of experience",
          lastUsed: "2023-04-25T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Listed as primary skill" },
            { type: "cv", date: "2023-04-01", details: "Evident throughout work history" },
            { type: "portfolio", date: "2023-04-10", details: "Extensive UI design examples in portfolio" },
            { type: "assessment", date: "2023-04-20", details: "Scored highly on UI design assessment" },
          ],
        },
        {
          name: "User Research",
          description: "Advanced level with 5+ years of experience",
          lastUsed: "2023-04-15T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Listed as skill" },
            { type: "portfolio", date: "2023-04-10", details: "User research case studies in portfolio" },
            { type: "hidi", date: "2023-02-28", details: "Detailed in HIDI record" },
          ],
        },
        {
          name: "Figma",
          description: "Expert level with 4+ years of experience",
          lastUsed: "2023-04-28T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Listed as skill" },
            { type: "portfolio", date: "2023-04-10", details: "All portfolio examples created in Figma" },
          ],
        },
        {
          name: "Design Systems",
          description: "Advanced level with 3+ years of experience",
          lastUsed: "2023-04-20T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Listed as skill" },
            { type: "hidi", date: "2023-02-28", details: "Focus of HIDI record" },
            { type: "portfolio", date: "2023-04-10", details: "Design system examples in portfolio" },
          ],
        },
      ],
      accomplishments: [
        {
          name: "Created comprehensive design system",
          description: "Developed a design system that improved design consistency and development efficiency",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Listed in achievements" },
            { type: "hidi", date: "2023-02-28", details: "Detailed in HIDI record" },
            { type: "portfolio", date: "2023-04-10", details: "Case study in portfolio" },
          ],
        },
        {
          name: "Redesigned core product",
          description: "Led the redesign of a core product that resulted in a 45% increase in user satisfaction",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Listed in achievements" },
            { type: "portfolio", date: "2023-04-10", details: "Featured case study in portfolio" },
            { type: "interview", date: "2023-04-25", details: "Discussed process during interview" },
          ],
        },
      ],
      objectives: [
        {
          name: "Improve accessibility",
          description: "Ensure all designs meet WCAG 2.1 AA standards",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Mentioned in career objectives" },
            { type: "hidi", date: "2023-02-28", details: "Emphasized in HIDI record" },
            { type: "interview", date: "2023-04-25", details: "Discussed as priority" },
          ],
        },
        {
          name: "Streamline design processes",
          description: "Implement efficient design workflows and documentation",
          sources: [
            { type: "interview", date: "2023-04-25", details: "Mentioned as area of interest" },
            { type: "question", date: "2023-04-27", details: "Detailed in follow-up questionnaire" },
          ],
        },
      ],
      results: [
        {
          name: "Increased user satisfaction by 45%",
          description: "Through user-centered design approach and iterative improvements",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Listed in achievements" },
            { type: "portfolio", date: "2023-04-10", details: "Metrics included in case study" },
            { type: "reference", date: "2023-04-28", details: "Confirmed by previous manager" },
          ],
        },
        {
          name: "Reduced design-to-development handoff time by 30%",
          description: "By implementing standardized design components and documentation",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Listed in achievements" },
            { type: "hidi", date: "2023-02-28", details: "Mentioned in HIDI record" },
          ],
        },
      ],
      capabilities: [
        {
          name: "User Interface Design",
          description: "Expert in creating visually appealing and intuitive user interfaces",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Evident from work history" },
            { type: "portfolio", date: "2023-04-10", details: "Demonstrated in portfolio" },
            { type: "assessment", date: "2023-04-20", details: "Confirmed in design assessment" },
          ],
        },
        {
          name: "User Experience Design",
          description: "Deep understanding of user-centered design principles",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Mentioned throughout work experience" },
            { type: "portfolio", date: "2023-04-10", details: "UX process documented in case studies" },
            { type: "interview", date: "2023-04-25", details: "Demonstrated knowledge during interview" },
          ],
        },
        {
          name: "Design Systems",
          description: "Proficient in creating and maintaining design systems",
          sources: [
            { type: "cv", date: "2023-04-01", details: "Listed in skills" },
            { type: "hidi", date: "2023-02-28", details: "Focus of HIDI record" },
            { type: "portfolio", date: "2023-04-10", details: "Examples in portfolio" },
          ],
        },
      ],
    },
    hidiRecords: [
      {
        title: "Creating an Accessible Design System from Scratch",
        summary: "My process for building a comprehensive design system that prioritizes accessibility",
        url: "https://app.qrusible.com/hidi/16h142i5-01fe-9j11-38ij-jkjkjk89k1i9/6kg356kg-f352-97g2-33he-98ieeg2i0if3",
        createdAt: "2023-02-28T11:10:00Z",
      },
    ],
    history: [
      {
        action: "Profile Updated",
        details: "Updated availability status and preferences",
        timestamp: "2023-04-30T16:15:00Z",
      },
      {
        action: "HIDI Added",
        details: "Added new HIDI record: Creating an Accessible Design System from Scratch",
        timestamp: "2023-02-28T11:10:00Z",
      },
    ],
  },
  {
    id: "5",
    name: "David Wilson",
    photo: "/thoughtful-man.png",
    title: "Data Scientist",
    email: "david.wilson@example.com",
    phone: "+1 (555) 567-8901",
    location: "Chicago, IL (Remote)",
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization", "TensorFlow", "PyTorch", "Statistics"],
    verified: true,
    availability: {
      status: "Partially Available",
      details: "Open to consulting or part-time opportunities",
      lastUpdated: "2023-04-05T13:40:00Z",
    },
    relevanceScore: 88,
    preferences: [
      "Tech, finance, or healthcare industries",
      "Remote work preferred",
      "Projects involving advanced analytics",
      "Collaborative research environments",
    ],
    experience: [
      {
        title: "Lead Data Scientist",
        company: "AnalyticsPro",
        startDate: "Jul 2018",
        endDate: "Present",
        description:
          "Leading data science initiatives for Fortune 500 clients, focusing on predictive analytics and machine learning solutions.",
      },
      {
        title: "Data Scientist",
        company: "TechInsights",
        startDate: "Feb 2015",
        endDate: "Jun 2018",
        description: "Developed machine learning models for customer segmentation and churn prediction.",
      },
    ],
    lastUpdated: "2023-04-05T13:40:00Z",
    talentGraph: {
      skills: [
        {
          name: "Python",
          description: "Expert level with 8+ years of experience",
          lastUsed: "2023-04-01T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Listed as primary skill" },
            { type: "cv", date: "2023-03-01", details: "Mentioned throughout work experience" },
            { type: "portfolio", date: "2023-03-10", details: "All portfolio projects use Python" },
            { type: "assessment", date: "2023-03-20", details: "Scored highly on Python assessment" },
          ],
        },
        {
          name: "Machine Learning",
          description: "Expert level with 6+ years of experience",
          lastUsed: "2023-03-28T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Listed as skill" },
            { type: "cv", date: "2023-03-01", details: "Mentioned throughout work experience" },
            { type: "hidi", date: "2023-03-15", details: "Focus of fraud detection HIDI" },
            { type: "hidi", date: "2022-12-10", details: "Detailed in customer segmentation HIDI" },
          ],
        },
        {
          name: "SQL",
          description: "Advanced level with 7+ years of experience",
          lastUsed: "2023-03-30T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Listed as skill" },
            { type: "cv", date: "2023-03-01", details: "Mentioned in work experience" },
          ],
        },
        {
          name: "TensorFlow",
          description: "Advanced level with 4+ years of experience",
          lastUsed: "2023-03-25T00:00:00Z",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Listed as skill" },
            { type: "hidi", date: "2023-03-15", details: "Used in fraud detection HIDI" },
          ],
        },
      ],
      accomplishments: [
        {
          name: "Developed fraud detection system",
          description: "Created a machine learning model that reduced fraud by 60% and saved $2M annually",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Listed in achievements" },
            { type: "hidi", date: "2023-03-15", details: "Detailed in HIDI record" },
            { type: "interview", date: "2023-03-25", details: "Discussed methodology during interview" },
          ],
        },
        {
          name: "Optimized marketing campaigns",
          description: "Implemented customer segmentation that increased campaign ROI by 35%",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Listed in achievements" },
            { type: "hidi", date: "2022-12-10", details: "Detailed in HIDI record" },
          ],
        },
      ],
      objectives: [
        {
          name: "Advance ML capabilities",
          description: "Research and implement cutting-edge machine learning techniques",
          sources: [
            { type: "interview", date: "2023-03-25", details: "Expressed as area of interest" },
            { type: "question", date: "2023-03-28", details: "Detailed in follow-up questionnaire" },
          ],
        },
        {
          name: "Improve data infrastructure",
          description: "Design scalable data pipelines and processing systems",
          sources: [{ type: "interview", date: "2023-03-25", details: "Mentioned as priority" }],
        },
      ],
      results: [
        {
          name: "Reduced operational costs by 25%",
          description: "Through predictive maintenance and resource optimization",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Listed in achievements" },
            { type: "interview", date: "2023-03-25", details: "Explained methodology during interview" },
          ],
        },
        {
          name: "Increased revenue by 15%",
          description: "By implementing recommendation systems and personalization",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Listed in achievements" },
            { type: "reference", date: "2023-04-01", details: "Confirmed by previous manager" },
          ],
        },
      ],
      capabilities: [
        {
          name: "Machine Learning",
          description: "Expert in developing and deploying machine learning models",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Evident from work history" },
            { type: "hidi", date: "2023-03-15", details: "Demonstrated in fraud detection HIDI" },
            { type: "hidi", date: "2022-12-10", details: "Shown in customer segmentation HIDI" },
            { type: "assessment", date: "2023-03-20", details: "Confirmed in ML assessment" },
          ],
        },
        {
          name: "Data Analysis",
          description: "Proficient in using data to drive business decisions",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Mentioned throughout work experience" },
            { type: "portfolio", date: "2023-03-10", details: "Multiple data analysis examples" },
          ],
        },
        {
          name: "Data Visualization",
          description: "Skilled in creating compelling data visualizations",
          sources: [
            { type: "cv", date: "2023-03-01", details: "Listed in skills" },
            { type: "portfolio", date: "2023-03-10", details: "Visualization examples in portfolio" },
          ],
        },
      ],
    },
    hidiRecords: [
      {
        title: "Building a Real-time Fraud Detection System",
        summary:
          "How I designed and implemented a machine learning system that detects fraudulent transactions in real-time",
        url: "https://app.qrusible.com/hidi/27i253j6-12gf-0k22-49jk-klklkl90l2j0/7lh467lh-g463-08h3-44if-09jffh3j1jg4",
        createdAt: "2023-03-15T10:30:00Z",
      },
      {
        title: "Customer Segmentation for Targeted Marketing",
        summary: "A case study on how I used clustering algorithms to improve marketing campaign effectiveness",
        url: "https://app.qrusible.com/hidi/38j364k7-23hg-1l33-50kl-lmlmlm01m3k1/8mi578mi-h574-19i4-55jg-10kggi4k2kh5",
        createdAt: "2022-12-10T14:50:00Z",
      },
    ],
    history: [
      {
        action: "Profile Updated",
        details: "Updated availability and skills information",
        timestamp: "2023-04-05T13:40:00Z",
      },
      {
        action: "HIDI Added",
        details: "Added new HIDI record: Building a Real-time Fraud Detection System",
        timestamp: "2023-03-15T10:30:00Z",
      },
    ],
  },
]
