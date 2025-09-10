"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface AssessmentFormProps {
  onComplete: (data: any) => void
  onBack: () => void
}

const questions = [
  {
    id: "difficulty",
    question: "How would you describe your reading difficulties?",
    options: [
      { value: "dyslexia", label: "I have trouble with letter recognition and word formation" },
      { value: "adhd", label: "I struggle with focus and attention while reading" },
      { value: "vision", label: "I have vision-related reading challenges" },
      { value: "multiple", label: "I experience multiple types of reading difficulties" },
      { value: "none", label: "I don't have significant reading difficulties" },
    ],
  },
  {
    id: "readingSpeed",
    question: "How would you rate your reading speed?",
    options: [
      { value: "very-slow", label: "Very slow - I read much slower than others" },
      { value: "slow", label: "Slow - I take more time than average" },
      { value: "average", label: "Average - Similar to most people" },
      { value: "fast", label: "Fast - I read faster than average" },
      { value: "very-fast", label: "Very fast - I'm a speed reader" },
    ],
  },
  {
    id: "comprehension",
    question: "How is your reading comprehension?",
    options: [
      { value: "poor", label: "Poor - I often don't understand what I read" },
      { value: "fair", label: "Fair - I sometimes struggle with comprehension" },
      { value: "good", label: "Good - I usually understand most content" },
      { value: "excellent", label: "Excellent - I have strong comprehension skills" },
      { value: "varies", label: "Varies - Depends on the content and format" },
    ],
  },
  {
    id: "focus",
    question: "How well can you maintain focus while reading?",
    options: [
      { value: "very-poor", label: "Very poor - I get distracted within minutes" },
      { value: "poor", label: "Poor - I struggle to focus for long periods" },
      { value: "fair", label: "Fair - I can focus with some effort" },
      { value: "good", label: "Good - I can maintain focus well" },
      { value: "excellent", label: "Excellent - I have no trouble focusing" },
    ],
  },
  {
    id: "preferences",
    question: "What reading adaptations would help you most?",
    options: [
      { value: "spacing", label: "Increased letter and line spacing" },
      { value: "fonts", label: "Dyslexia-friendly fonts" },
      { value: "colors", label: "High contrast colors and backgrounds" },
      { value: "audio", label: "Text-to-speech and audio support" },
      { value: "all", label: "Multiple adaptations combined" },
    ],
  },
]

export function AssessmentForm({ onComplete, onBack }: AssessmentFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Calculate results and complete assessment
      const score = calculateScore(answers)
      const recommendations = generateRecommendations(answers)

      onComplete({
        ...answers,
        score,
        recommendations,
      })
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateScore = (answers: Record<string, string>) => {
    // Simple scoring logic - in real app this would be more sophisticated
    let score = 0
    if (answers.difficulty !== "none") score += 20
    if (answers.readingSpeed === "very-slow" || answers.readingSpeed === "slow") score += 20
    if (answers.comprehension === "poor" || answers.comprehension === "fair") score += 20
    if (answers.focus === "very-poor" || answers.focus === "poor") score += 20
    if (answers.preferences !== "none") score += 20
    return score
  }

  const generateRecommendations = (answers: Record<string, string>) => {
    const recommendations = []

    if (answers.difficulty === "dyslexia") {
      recommendations.push("Use dyslexia-friendly fonts like OpenDyslexic")
      recommendations.push("Increase letter and word spacing")
    }

    if (answers.difficulty === "adhd") {
      recommendations.push("Break text into smaller chunks")
      recommendations.push("Use highlighting and focus tools")
    }

    if (answers.difficulty === "vision") {
      recommendations.push("Increase text size to 150%")
      recommendations.push("Use high contrast color schemes")
    }

    if (answers.preferences === "audio" || answers.preferences === "all") {
      recommendations.push("Enable text-to-speech features")
    }

    return recommendations
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentAnswer = answers[questions[currentQuestion].id]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-muted-foreground hover:text-foreground"
          aria-label="Go back to landing page"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-2">Reading Assessment</h1>
        <p className="text-muted-foreground mb-4">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <Progress
          value={progress}
          className="w-full"
          aria-label={`Assessment progress: ${Math.round(progress)}% complete`}
        />
      </div>

      {/* Question Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-card-foreground">{questions[currentQuestion].question}</CardTitle>
          <CardDescription>Select the option that best describes your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={currentAnswer || ""} onValueChange={handleAnswerChange} className="space-y-4">
            {questions[currentQuestion].options.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                <Label htmlFor={option.value} className="text-sm leading-relaxed cursor-pointer text-card-foreground">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="border-border bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {currentQuestion === questions.length - 1 ? "Complete Assessment" : "Next"}
          {currentQuestion < questions.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}
