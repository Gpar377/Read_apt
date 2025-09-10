"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react"

interface AssessmentData {
  difficulty: string
  readingSpeed: string
  comprehension: string
  focus: string
  preferences: string
  score: number
  recommendations: string[]
}

interface AssessmentResultsProps {
  data: AssessmentData
  onStartAdaptation: () => void
  onRetakeAssessment: () => void
}

export function AssessmentResults({ data, onStartAdaptation, onRetakeAssessment }: AssessmentResultsProps) {
  const getScoreLevel = (score: number) => {
    if (score >= 80)
      return { level: "High", color: "bg-destructive", description: "Significant reading challenges detected" }
    if (score >= 60)
      return { level: "Moderate", color: "bg-secondary", description: "Some reading difficulties identified" }
    if (score >= 40) return { level: "Mild", color: "bg-accent", description: "Minor reading challenges found" }
    return { level: "Low", color: "bg-primary", description: "Minimal reading difficulties detected" }
  }

  const scoreInfo = getScoreLevel(data.score)

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case "dyslexia":
        return "Dyslexia-related challenges with letter recognition and word formation"
      case "adhd":
        return "ADHD-related focus and attention difficulties while reading"
      case "vision":
        return "Vision-related reading challenges requiring visual adaptations"
      case "multiple":
        return "Multiple types of reading difficulties requiring comprehensive support"
      default:
        return "General reading optimization recommended"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Assessment Complete</h1>
        <p className="text-lg text-muted-foreground">Here are your personalized reading recommendations</p>
      </div>

      {/* Score Card */}
      <Card className="bg-card border-border mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-card-foreground">Assessment Score</CardTitle>
          <CardDescription>Based on your responses to the 5-question evaluation</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-foreground">{data.score}/100</div>
            <Badge className={`${scoreInfo.color} text-white px-3 py-1`}>{scoreInfo.level} Need</Badge>
          </div>
          <p className="text-muted-foreground mb-4">{scoreInfo.description}</p>
          <p className="text-sm text-card-foreground bg-muted p-3 rounded-lg">
            {getDifficultyDescription(data.difficulty)}
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-card-foreground">Personalized Recommendations</CardTitle>
          <CardDescription>Based on your assessment, we recommend these adaptations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-card-foreground">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Summary */}
      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-card-foreground">Your Responses</CardTitle>
          <CardDescription>Summary of your assessment answers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-card-foreground">Reading Difficulties:</span>
              <span className="text-muted-foreground capitalize">{data.difficulty.replace("-", " ")}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-card-foreground">Reading Speed:</span>
              <span className="text-muted-foreground capitalize">{data.readingSpeed.replace("-", " ")}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-card-foreground">Comprehension:</span>
              <span className="text-muted-foreground capitalize">{data.comprehension}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-card-foreground">Focus Level:</span>
              <span className="text-muted-foreground capitalize">{data.focus.replace("-", " ")}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-card-foreground">Preferred Adaptations:</span>
              <span className="text-muted-foreground capitalize">{data.preferences}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onStartAdaptation}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Start using text adaptation tools"
        >
          Try Text Adaptation
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <Button
          onClick={onRetakeAssessment}
          variant="outline"
          size="lg"
          className="border-border bg-transparent"
          aria-label="Retake the assessment"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Assessment
        </Button>
      </div>
    </div>
  )
}
