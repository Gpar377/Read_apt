"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { apiService } from "@/services/api"

const adhdQuestions = [
  "Often fails to give close attention to details or makes careless mistakes",
  "Often has difficulty sustaining attention in tasks or play activities", 
  "Often does not seem to listen when spoken to directly",
  "Often does not follow through on instructions and fails to finish work",
  "Often has difficulty organizing tasks and activities",
  "Often avoids tasks that require sustained mental effort",
  "Often loses things necessary for tasks or activities",
  "Is often easily distracted by extraneous stimuli",
  "Is often forgetful in daily activities",
  "Often fidgets with hands or feet or squirms in seat",
  "Often leaves seat in situations when remaining seated is expected",
  "Often runs about or climbs excessively in inappropriate situations",
  "Often has difficulty playing or engaging in leisure activities quietly",
  "Is often 'on the go' or acts as if 'driven by a motor'",
  "Often talks excessively",
  "Often blurts out answers before questions have been completed",
  "Often has difficulty waiting turn",
  "Often interrupts or intrudes on others"
]

interface ADHDAssessmentProps {
  onComplete: (result: any) => void
  onBack: () => void
}

export function ADHDAssessment({ onComplete, onBack }: ADHDAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(18).fill(-1))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = parseInt(value)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < adhdQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await apiService.predictADHD({
        answers: answers
      })
      onComplete(result)
    } catch (error) {
      console.error('ADHD assessment failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / adhdQuestions.length) * 100
  const isLastQuestion = currentQuestion === adhdQuestions.length - 1
  const canProceed = answers[currentQuestion] >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>ADHD Assessment</CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {adhdQuestions.length} - Rate how often this applies to you
        </CardDescription>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{adhdQuestions[currentQuestion]}</h3>
          <RadioGroup 
            value={answers[currentQuestion].toString()} 
            onValueChange={handleAnswerChange}
          >
            {[
              { value: "0", label: "Never" },
              { value: "1", label: "Sometimes" },
              { value: "2", label: "Often" },
              { value: "3", label: "Very Often" }
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={currentQuestion === 0 ? onBack : handlePrevious}>
            {currentQuestion === 0 ? "Back" : "Previous"}
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Complete Assessment"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed}>
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}