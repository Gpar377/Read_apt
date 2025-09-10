"use client"

import { useState } from "react"
import { LandingPage } from "./LandingPage"
import { AssessmentForm } from "./AssessmentForm"
import { AssessmentResults } from "./AssessmentResults"
import { TextAdaptation } from "./TextAdaptation"

type AppState = "landing" | "assessment" | "results" | "adaptation"

interface AssessmentData {
  difficulty: string
  readingSpeed: string
  comprehension: string
  focus: string
  preferences: string
  score: number
  recommendations: string[]
}

export function ReadAptApp() {
  const [currentState, setCurrentState] = useState<AppState>("landing")
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)

  const handleStartAssessment = () => {
    setCurrentState("assessment")
  }

  const handleAssessmentComplete = (data: AssessmentData) => {
    setAssessmentData(data)
    setCurrentState("results")
  }

  const handleStartAdaptation = () => {
    setCurrentState("adaptation")
  }

  const handleBackToLanding = () => {
    setCurrentState("landing")
    setAssessmentData(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {currentState === "landing" && <LandingPage onStartAssessment={handleStartAssessment} />}

      {currentState === "assessment" && (
        <AssessmentForm onComplete={handleAssessmentComplete} onBack={() => setCurrentState("landing")} />
      )}

      {currentState === "results" && assessmentData && (
        <AssessmentResults
          data={assessmentData}
          onStartAdaptation={handleStartAdaptation}
          onRetakeAssessment={() => setCurrentState("assessment")}
        />
      )}

      {currentState === "adaptation" && (
        <TextAdaptation
          assessmentData={assessmentData}
          onBack={() => setCurrentState("results")}
          onHome={handleBackToLanding}
        />
      )}
    </div>
  )
}
