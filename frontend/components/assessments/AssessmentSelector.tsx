"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Eye } from "lucide-react"
import { DyslexiaAssessment } from "./DyslexiaAssessment"
import { ADHDAssessment } from "./ADHDAssessment"
import { VisionAssessment } from "./VisionAssessment"
import { AssessmentComplete } from "./AssessmentComplete"

type AssessmentType = "selector" | "dyslexia" | "adhd" | "vision" | "complete"

interface AssessmentSelectorProps {
  onComplete?: (results: any) => void
}

export function AssessmentSelector({ onComplete }: AssessmentSelectorProps) {
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentType>("selector")
  const [results, setResults] = useState<any>({})

  const handleAssessmentComplete = (type: string, result: any) => {
    const newResults = { ...results, [type]: result }
    setResults(newResults)
    
    // Store in localStorage
    localStorage.setItem("assessmentResults", JSON.stringify(newResults))
    
    // Show completion screen
    setCurrentAssessment("complete")
    
    if (onComplete) {
      onComplete(newResults)
    }
  }

  const assessmentTypes = [
    {
      id: "dyslexia",
      title: "Dyslexia Assessment",
      description: "Reading speed test + survey evaluation",
      icon: Brain,
      color: "text-primary",
      completed: !!results.dyslexia
    },
    {
      id: "adhd", 
      title: "ADHD Assessment",
      description: "18 behavioral questions (0-3 scale)",
      icon: Zap,
      color: "text-accent",
      completed: !!results.adhd
    },
    {
      id: "vision",
      title: "Vision Assessment", 
      description: "Glasses prescription power evaluation",
      icon: Eye,
      color: "text-secondary",
      completed: !!results.vision
    }
  ]

  if (currentAssessment === "dyslexia") {
    return (
      <DyslexiaAssessment
        onComplete={(result) => handleAssessmentComplete("dyslexia", result)}
        onBack={() => setCurrentAssessment("selector")}
      />
    )
  }

  if (currentAssessment === "adhd") {
    return (
      <ADHDAssessment
        onComplete={(result) => handleAssessmentComplete("adhd", result)}
        onBack={() => setCurrentAssessment("selector")}
      />
    )
  }

  if (currentAssessment === "vision") {
    return (
      <VisionAssessment
        onComplete={(result) => handleAssessmentComplete("vision", result)}
        onBack={() => setCurrentAssessment("selector")}
      />
    )
  }

  if (currentAssessment === "complete") {
    return (
      <AssessmentComplete
        onRetakeAssessment={() => setCurrentAssessment("selector")}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Assessment Center</h2>
        <p className="text-muted-foreground">
          Complete assessments to get personalized accessibility adaptations
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {assessmentTypes.map((assessment) => {
          const Icon = assessment.icon
          return (
            <Card key={assessment.id} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className={`w-8 h-8 ${assessment.color}`} />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {assessment.title}
                      {assessment.completed && (
                        <span className="text-green-600 text-sm">✓</span>
                      )}
                    </CardTitle>
                    <CardDescription>{assessment.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setCurrentAssessment(assessment.id as AssessmentType)}
                  className="w-full"
                  variant={assessment.completed ? "outline" : "default"}
                >
                  {assessment.completed ? "Retake Assessment" : "Start Assessment"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {Object.keys(results).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Results</CardTitle>
            <CardDescription>Your completed assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.dyslexia && (
                <p>✓ Dyslexia: {results.dyslexia.severity || "Completed"}</p>
              )}
              {results.adhd && (
                <p>✓ ADHD: {results.adhd.type || "Completed"}</p>
              )}
              {results.vision && (
                <p>✓ Vision: {results.vision.level || "Completed"}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}