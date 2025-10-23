"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Briefcase, MapPin, DollarSign, PenTool, Brain } from "lucide-react"

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters?: (filters: string[]) => void
  activeFilters?: string[]
}

export function FilterDialog({ open, onOpenChange, onApplyFilters, activeFilters = [] }: FilterDialogProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedEngagementTypes, setSelectedEngagementTypes] = useState<string[]>([])
  const [experienceRange, setExperienceRange] = useState([0, 15])
  const [compensationRange, setCompensationRange] = useState([50000, 200000])
  const [availability, setAvailability] = useState<string>("any")

  // Initialize filters from activeFilters prop
  useEffect(() => {
    if (activeFilters.length > 0) {
      // Parse active filters and set state accordingly
      // This is a simplified implementation - in a real app, you'd need to parse the filter strings
      const skills = activeFilters.filter((f) => f.startsWith("Skill:")).map((f) => f.replace("Skill:", ""))
      const capabilities = activeFilters
        .filter((f) => f.startsWith("Capability:"))
        .map((f) => f.replace("Capability:", ""))
      const traits = activeFilters.filter((f) => f.startsWith("Trait:")).map((f) => f.replace("Trait:", ""))
      const locations = activeFilters.filter((f) => f.startsWith("Location:")).map((f) => f.replace("Location:", ""))
      const engagementTypes = activeFilters
        .filter((f) => f.startsWith("Engagement:"))
        .map((f) => f.replace("Engagement:", ""))

      setSelectedSkills(skills)
      setSelectedCapabilities(capabilities)
      setSelectedTraits(traits)
      setSelectedLocations(locations)
      setSelectedEngagementTypes(engagementTypes)

      // Handle compensation and experience ranges if needed
    }
  }, [activeFilters, open])

  const skills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "AWS",
    "DevOps",
    "Product Management",
    "UX Design",
    "Data Science",
  ]

  const capabilities = [
    "Team Leadership",
    "Project Management",
    "Strategic Planning",
    "Client Communication",
    "Problem Solving",
    "System Architecture",
    "Code Review",
    "Mentoring",
    "Technical Writing",
    "Agile Methodology",
  ]

  const traits = [
    "Detail-oriented",
    "Creative",
    "Analytical",
    "Team Player",
    "Self-motivated",
    "Adaptable",
    "Proactive",
    "Organized",
    "Communicative",
    "Resilient",
  ]

  const locations = [
    "Remote",
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "Australia",
    "India",
    "Singapore",
  ]

  const engagementTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Consulting"]

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const toggleCapability = (capability: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capability) ? prev.filter((c) => c !== capability) : [...prev, capability],
    )
  }

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) => (prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]))
  }

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
  }

  const toggleEngagementType = (type: string) => {
    setSelectedEngagementTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setSelectedCapabilities([])
    setSelectedTraits([])
    setSelectedLocations([])
    setSelectedEngagementTypes([])
    setExperienceRange([0, 15])
    setCompensationRange([50000, 200000])
    setAvailability("any")
  }

  const handleApply = () => {
    // Convert selected filters to string array
    const filters: string[] = [
      ...selectedSkills.map((skill) => `Skill: ${skill}`),
      ...selectedCapabilities.map((capability) => `Capability: ${capability}`),
      ...selectedTraits.map((trait) => `Trait: ${trait}`),
      ...selectedLocations.map((location) => `Location: ${location}`),
      ...selectedEngagementTypes.map((type) => `Engagement: ${type}`),
    ]

    // Add compensation range if not default
    if (compensationRange[0] !== 50000 || compensationRange[1] !== 200000) {
      filters.push(
        `Compensation: $${compensationRange[0].toLocaleString()} - $${compensationRange[1].toLocaleString()}`,
      )
    }

    // Add availability if not "any"
    if (availability !== "any") {
      filters.push(`Availability: ${availability}`)
    }

    if (onApplyFilters) {
      onApplyFilters(filters)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Filter Talent</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left column */}
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                Skills
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b">
                    <span className="text-sm font-medium">Selected:</span>
                    {selectedSkills.map((skill) => (
                      <div key={skill} className="bg-muted rounded-full px-2 py-0.5 text-xs flex items-center">
                        {skill}
                        <button
                          onClick={() => toggleSkill(skill)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => toggleSkill(skill)}
                    />
                    <Label htmlFor={`skill-${skill}`} className="text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Capabilities
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {selectedCapabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b">
                    <span className="text-sm font-medium">Selected:</span>
                    {selectedCapabilities.map((capability) => (
                      <div key={capability} className="bg-muted rounded-full px-2 py-0.5 text-xs flex items-center">
                        {capability}
                        <button
                          onClick={() => toggleCapability(capability)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {capabilities.map((capability) => (
                  <div key={capability} className="flex items-center space-x-2">
                    <Checkbox
                      id={`capability-${capability}`}
                      checked={selectedCapabilities.includes(capability)}
                      onCheckedChange={() => toggleCapability(capability)}
                    />
                    <Label htmlFor={`capability-${capability}`} className="text-sm">
                      {capability}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {selectedLocations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b">
                    <span className="text-sm font-medium">Selected:</span>
                    {selectedLocations.map((location) => (
                      <div key={location} className="bg-muted rounded-full px-2 py-0.5 text-xs flex items-center">
                        {location}
                        <button
                          onClick={() => toggleLocation(location)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={() => toggleLocation(location)}
                    />
                    <Label htmlFor={`location-${location}`} className="text-sm">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Engagement Type
              </h3>
              <div className="space-y-2">
                {selectedEngagementTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b">
                    <span className="text-sm font-medium">Selected:</span>
                    {selectedEngagementTypes.map((type) => (
                      <div key={type} className="bg-muted rounded-full px-2 py-0.5 text-xs flex items-center">
                        {type}
                        <button
                          onClick={() => toggleEngagementType(type)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {engagementTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`engagement-${type}`}
                      checked={selectedEngagementTypes.includes(type)}
                      onCheckedChange={() => toggleEngagementType(type)}
                    />
                    <Label htmlFor={`engagement-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Compensation
              </h3>
              <div className="space-y-4">
                <Slider
                  value={compensationRange}
                  min={30000}
                  max={300000}
                  step={5000}
                  onValueChange={setCompensationRange}
                />
                <div className="flex justify-between text-sm">
                  <span>${compensationRange[0].toLocaleString()}</span>
                  <span>${compensationRange[1].toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={compensationRange[0]}
                    onChange={(e) => setCompensationRange([Number.parseInt(e.target.value), compensationRange[1]])}
                    className="w-24"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={compensationRange[1]}
                    onChange={(e) => setCompensationRange([compensationRange[0], Number.parseInt(e.target.value)])}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between border-t pt-4">
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
