"use client"

import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { CandidateInfoPanel } from "./candidate-info-panel"
import { X } from "lucide-react"

interface CandidateScoringPanelProps {
  candidate: any
  title?: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

export function CandidateScoringPanel({ candidate, title = "Candidate Scoring", isOpen, onClose, children }: CandidateScoringPanelProps) {
  if (!candidate) return null

  const panelContent = (
    <>
      {/* Sliding Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[480px] bg-background border-l shadow-xl transition-transform duration-300 ease-in-out z-[9999] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Compact Candidate Info Panel */}
            <CandidateInfoPanel candidate={candidate} />

            {/* Custom Content (for stage-specific content) */}
            {children}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[9998] transition-opacity" onClick={onClose} />}
    </>
  )

  // Render using portal to ensure proper z-index stacking
  if (typeof window === "undefined") return null
  
  return createPortal(panelContent, document.body)
}

