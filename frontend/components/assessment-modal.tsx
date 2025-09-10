"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Brain, Eye, Focus } from "lucide-react"

interface AssessmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const assessmentQuestions = [
  {
    id: 1,
    category: "Reading Difficulties",
    icon: Brain,
    question: "How often do you experience difficulty reading text?",
    options: [
      { value: "never", label: "Never" },
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often", label: "Often" },
      { value: "always", label: "Always" },
    ],
  },
  {
    id: 2,
    category: "Visual Processing",
    icon: Eye,
    question: "Do letters or words appear to move, blur, or jump around when reading?",
    options: [
      { value: "never", label: "Never" },
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often", label: "Often" },
      { value: "always", label: "Always" },
    ],
  },
  {
    id: 3,
    category: "Attention & Focus",
    icon: Focus,
    question: "How easily do you lose focus while reading?",
    options: [
      { value: "never", label: "I maintain focus easily" },
      { value: "rarely", label: "Rarely lose focus" },
      { value: "sometimes", label: "Sometimes lose focus" },
      { value: "often", label: "Often lose focus" },
      { value: "always", label: "Always struggle to focus" },
    ],
  },
  {
    id: 4,
    category: "Reading Speed",
    icon: Brain,
    question: "How would you describe your reading speed?",
    options: [
      { value: "very-fast", label: "Very fast" },
      { value: "fast", label: "Fast" },
      { value: "average", label: "Average" },
      { value: "slow", label: "Slow" },
      { value: "very-slow", label: "Very slow" },
    ],
  },
  {
    id: 5,
    category: "Comprehension",
    icon: Brain,
    question: "How often do you need to re-read text to understand it?",
    options: [
      { value: "never", label: "Never" },
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often", label: "Often" },
      { value: "always", label: "Always" },
    ],
  },
]

export function AssessmentModal({ open, onOpenChange }: AssessmentModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  const getAssessmentResults = () => {
    // Simple scoring logic - in a real app, this would be more sophisticated
    const scores = Object.values(answers)
    const highRiskAnswers = scores.filter(
      (answer) => answer === "often" || answer === "always" || answer === "slow" || answer === "very-slow",
    ).length

    if (highRiskAnswers >= 3) {
      return {
        risk: "high",
        title: "Significant Reading Challenges Detected",
        description: "Your responses suggest you may benefit significantly from reading adaptations.",
        recommendations: [
          "Use dyslexia-friendly fonts like OpenDyslexic",
          "Increase line spacing and letter spacing",
          "Try high-contrast color schemes",
          "Use text-to-speech for difficult passages",
        ],
      }
    } else if (highRiskAnswers >= 1) {
      return {
        risk: "moderate",
        title: "Some Reading Difficulties Identified",
        description: "You may benefit from certain reading adaptations.",
        recommendations: [
          "Experiment with different font sizes",
          "Try adjusting background colors",
          "Use text-to-speech when needed",
          "Take regular breaks while reading",
        ],
      }
    } else {
      return {
        risk: "low",
        title: "Minimal Reading Difficulties",
        description: "You appear to have good reading abilities, but adaptations can still help.",
        recommendations: [
          "Customize settings for comfort",
          "Try text-to-speech for multitasking",
          "Experiment with different themes",
          "Use our tools for challenging texts",
        ],
      }
    }
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Reading Assessment</DialogTitle>
          <DialogDescription>
            Help us understand your reading needs to provide personalized adaptations
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Question {currentQuestion + 1} of {assessmentQuestions.length}
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {assessmentQuestions[currentQuestion].icon &&
                    assessmentQuestions[currentQuestion].icon({ className: "w-6 h-6 text-primary" })}
                  <div>
                    <CardTitle className="text-lg">{assessmentQuestions[currentQuestion].category}</CardTitle>
                    <CardDescription>{assessmentQuestions[currentQuestion].question}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[assessmentQuestions[currentQuestion].id] || ""}
                  onValueChange={(value) => handleAnswer(assessmentQuestions[currentQuestion].id, value)}
                >
                  {assessmentQuestions[currentQuestion].options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                Previous
              </Button>
              <Button onClick={handleNext} disabled={!answers[assessmentQuestions[currentQuestion].id]}>
                {currentQuestion === assessmentQuestions.length - 1 ? "Get Results" : "Next"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {(() => {
              const results = getAssessmentResults()
              return (
                <>
                  <div className="text-center space-y-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                        results.risk === "high"
                          ? "bg-orange-100 text-orange-600"
                          : results.risk === "moderate"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{results.title}</h3>
                      <p className="text-muted-foreground">{results.description}</p>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Personalized Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {results.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button onClick={() => onOpenChange(false)} className="flex-1">
                      Start Reading
                    </Button>
                    <Button variant="outline" onClick={resetAssessment}>
                      Retake Assessment
                    </Button>
                  </div>
                </>
              )
            })()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
