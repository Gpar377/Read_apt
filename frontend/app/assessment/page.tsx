"use client"

import { useState } from "react"
import { MainLayout } from "@/components/templates/MainLayout"
import { DisorderSelection } from "@/components/DisorderSelection"
import { DyslexiaAssessment } from "@/components/assessments/DyslexiaAssessment"
import { ADHDAssessment } from "@/components/assessments/ADHDAssessment"
import { VisionAssessmentDirect } from "@/components/assessments/VisionAssessmentDirect"

export default function AssessmentPage() {
  const [selectedDisorder, setSelectedDisorder] = useState<string | null>(null)

  const handleDisorderSelect = (disorder: "dyslexia" | "adhd" | "vision") => {
    setSelectedDisorder(disorder)
  }

  const handleBack = () => {
    setSelectedDisorder(null)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {selectedDisorder === "dyslexia" && (
          <DyslexiaAssessment onComplete={() => {}} onBack={handleBack} />
        )}
        {selectedDisorder === "adhd" && (
          <ADHDAssessment onComplete={() => {}} onBack={handleBack} />
        )}
        {selectedDisorder === "vision" && (
          <VisionAssessmentDirect onComplete={() => {}} onBack={handleBack} />
        )}
        {!selectedDisorder && (
          <DisorderSelection onDisorderSelect={handleDisorderSelect} />
        )}
      </div>
    </MainLayout>
  )
}
