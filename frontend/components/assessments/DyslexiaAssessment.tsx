"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { apiService } from "@/services/api"

interface DyslexiaAssessmentProps {
  onComplete: (result: any) => void
  onBack: () => void
}

export function DyslexiaAssessment({ onComplete, onBack }: DyslexiaAssessmentProps) {
  const [step, setStep] = useState(0)
  const [readingSpeed, setReadingSpeed] = useState(0)
  const [surveyScore, setSurveyScore] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const testText = "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice."

  const startReadingTest = () => {
    setIsReading(true)
    setReadingStartTime(Date.now())
  }

  const finishReadingTest = () => {
    if (readingStartTime) {
      const readingTime = (Date.now() - readingStartTime) / 1000
      const wordsInText = testText.split(' ').length
      const wpm = (wordsInText / readingTime) * 60
      const normalizedSpeed = Math.min(wpm / 200, 1)
      setReadingSpeed(normalizedSpeed)
      setIsReading(false)
      setReadingStartTime(null)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await apiService.predictDyslexia({
        reading_speed: readingSpeed,
        survey_score: surveyScore
      })
      onComplete(result)
    } catch (error) {
      console.error('Dyslexia assessment failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((step + 1) / 2) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dyslexia Assessment</CardTitle>
        <CardDescription>Reading speed test + survey evaluation</CardDescription>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 0 ? (
          <div>
            <h3 className="text-lg font-medium mb-4">Reading Speed Test</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-lg leading-relaxed">{testText}</p>
              </div>
              {!isReading && readingSpeed === 0 && (
                <Button onClick={startReadingTest}>Start Reading Test</Button>
              )}
              {isReading && (
                <Button onClick={finishReadingTest} variant="destructive">Finished Reading</Button>
              )}
              {readingSpeed > 0 && (
                <p className="text-green-600">✓ Reading speed recorded</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-4">Survey Question</h3>
            <p className="mb-4">Rate your agreement: "I often confuse similar looking letters or words when reading"</p>
            <RadioGroup value={surveyScore.toString()} onValueChange={(v) => setSurveyScore(parseFloat(v))}>
              {[
                { value: "0", label: "Strongly Disagree" },
                { value: "0.25", label: "Disagree" },
                { value: "0.5", label: "Neutral" },
                { value: "0.75", label: "Agree" },
                { value: "1", label: "Strongly Agree" }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={step === 0 ? onBack : () => setStep(0)}>
            {step === 0 ? "Back" : "Previous"}
          </Button>
          
          {step === 0 ? (
            <Button onClick={() => setStep(1)} disabled={readingSpeed === 0}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={surveyScore === 0 || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Complete Assessment"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}