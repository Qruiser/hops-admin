"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface JobSpec {
  role: string
  skills: { name: string; isPriority: boolean }[]
  traits: { name: string; isPriority: boolean }[]
  capabilities: { name: string; isPriority: boolean }[]
  results: { name: string; isPriority: boolean }[]
  attitudes: { name: string; isPriority: boolean }[]
}

const MAX_PRIORITIES = 2

export function JobSpecEditor() {
  const [jobSpec, setJobSpec] = useState<JobSpec>({
    role: "Senior Developer",
    skills: [
      { name: "React", isPriority: true },
      { name: "TypeScript", isPriority: true },
      { name: "Node.js", isPriority: false },
      { name: "GraphQL", isPriority: false },
    ],
    traits: [
      { name: "Problem solver", isPriority: true },
      { name: "Team player", isPriority: false },
      { name: "Self-motivated", isPriority: false },
    ],
    capabilities: [
      { name: "Building scalable applications", isPriority: true },
      { name: "Code reviews", isPriority: false },
      { name: "Technical documentation", isPriority: false },
    ],
    results: [
      { name: "Delivered complex projects on time", isPriority: true },
      { name: "Reduced application load time by 30%", isPriority: false },
      { name: "Implemented CI/CD pipelines", isPriority: false },
    ],
    attitudes: [
      { name: "Growth mindset", isPriority: true },
      { name: "Customer-focused", isPriority: false },
      { name: "Detail-oriented", isPriority: false },
    ],
  })

  const [newItem, setNewItem] = useState<{
    category: keyof Omit<JobSpec, "role">
    name: string
  }>({
    category: "skills",
    name: "",
  })

  const handleInputChange = (field: keyof JobSpec, value: string) => {
    setJobSpec((prev) => ({ ...prev, [field]: value }))
  }

  const toggleItemPriority = (field: keyof Omit<JobSpec, "role">, index: number) => {
    setJobSpec((prev) => {
      const newItems = [...prev[field]]
      const currentPriorityCount = newItems.filter((item) => item.isPriority).length

      if (!newItems[index].isPriority && currentPriorityCount >= MAX_PRIORITIES) {
        return prev
      }

      newItems[index] = { ...newItems[index], isPriority: !newItems[index].isPriority }
      return { ...prev, [field]: newItems }
    })
  }

  const addNewItem = () => {
    if (!newItem.name.trim()) return

    setJobSpec((prev) => ({
      ...prev,
      [newItem.category]: [...prev[newItem.category], { name: newItem.name, isPriority: false }],
    }))

    setNewItem({ ...newItem, name: "" })
  }

  const removeItem = (category: keyof Omit<JobSpec, "role">, index: number) => {
    setJobSpec((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Specification</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid gap-6 p-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={jobSpec.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                {(["skills", "traits", "capabilities", "results", "attitudes"] as const).map((field) => (
                  <div key={field} className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor={field} className="text-right pt-2">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <div className="col-span-3 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {jobSpec[field].map((item, index) => (
                          <Badge
                            key={index}
                            variant={item.isPriority ? "default" : "outline"}
                            className="flex items-center gap-1 py-1 px-2"
                          >
                            <span>{item.name}</span>
                            <button
                              onClick={() => toggleItemPriority(field, index)}
                              className="ml-1 hover:bg-primary-foreground rounded-full p-0.5"
                              title={item.isPriority ? "Remove priority" : "Mark as priority"}
                            >
                              {item.isPriority ? "★" : "☆"}
                            </button>
                            <button
                              onClick={() => removeItem(field, index)}
                              className="ml-1 hover:bg-primary-foreground rounded-full p-0.5"
                              title="Remove item"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}

                        {newItem.category === field && (
                          <div className="flex items-center gap-2">
                            <Input
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              placeholder={`Add new ${field.slice(0, -1)}`}
                              className="w-48"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  addNewItem()
                                }
                              }}
                            />
                            <Button size="sm" onClick={addNewItem}>
                              Add
                            </Button>
                          </div>
                        )}

                        {newItem.category !== field && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewItem({ category: field, name: "" })}
                            className="flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Add {field.slice(0, -1)}
                          </Button>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        You can mark up to {MAX_PRIORITIES} items as priority in each category.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-6 flex justify-end">
              <Button>Save Specification</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Specification Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Role</h3>
                  <p>{jobSpec.role}</p>
                </div>

                {(["skills", "traits", "capabilities", "results", "attitudes"] as const).map((field) => (
                  <div key={field}>
                    <h3 className="font-semibold mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</h3>
                    <div className="space-y-2">
                      {jobSpec[field].length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {jobSpec[field].map((item, index) => (
                            <Badge key={index} variant={item.isPriority ? "default" : "outline"}>
                              {item.name} {item.isPriority && "(Priority)"}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No {field} specified</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
