"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileEdit } from "lucide-react"

interface QruSpec {
  role: string
  skills: { name: string; isPriority: boolean }[]
  traits: { name: string; isPriority: boolean }[]
  capabilities: { name: string; isPriority: boolean }[]
  results: { name: string; isPriority: boolean }[]
  attitudes: { name: string; isPriority: boolean }[]
}

const MAX_PRIORITIES = 2

export function QruSpecEditor() {
  const [qruSpec, setQruSpec] = useState<QruSpec>({
    role: "",
    skills: [],
    traits: [],
    capabilities: [],
    results: [],
    attitudes: [],
  })

  const handleInputChange = (field: keyof QruSpec, value: string) => {
    setQruSpec((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayInputChange = (field: keyof Omit<QruSpec, "role">, value: string) => {
    const items = value.split(",").map((item) => ({ name: item.trim(), isPriority: false }))
    setQruSpec((prev) => ({ ...prev, [field]: items }))
  }

  const toggleItemPriority = (field: keyof Omit<QruSpec, "role">, index: number) => {
    setQruSpec((prev) => {
      const newItems = [...prev[field]]
      const currentPriorityCount = newItems.filter((item) => item.isPriority).length

      if (!newItems[index].isPriority && currentPriorityCount >= MAX_PRIORITIES) {
        return prev
      }

      newItems[index] = { ...newItems[index], isPriority: !newItems[index].isPriority }
      return { ...prev, [field]: newItems }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileEdit className="mr-2 h-4 w-4" />
          Edit Qru Spec
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full h-full flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Qru Spec</DialogTitle>
          <DialogDescription>
            Update the Qru spec for this role. You can prioritize up to {MAX_PRIORITIES} items in each category.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="grid gap-6 p-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={qruSpec.role}
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
                  <Textarea
                    id={field}
                    value={qruSpec[field].map((item) => item.name).join(", ")}
                    onChange={(e) => handleArrayInputChange(field, e.target.value)}
                    className="min-h-[100px]"
                    placeholder={`Enter ${field} separated by commas`}
                  />
                  <div className="space-y-2">
                    {qruSpec[field].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${field}-priority-${index}`}
                          checked={item.isPriority}
                          onCheckedChange={() => toggleItemPriority(field, index)}
                          disabled={
                            !item.isPriority && qruSpec[field].filter((i) => i.isPriority).length >= MAX_PRIORITIES
                          }
                        />
                        <label
                          htmlFor={`${field}-priority-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.name} {item.isPriority && "(Priority)"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogTrigger asChild>
          <Button type="submit" className="mt-4">
            Save changes
          </Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  )
}
