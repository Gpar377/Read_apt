"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { apiService } from "@/services/api"
import { AssessmentRedirect } from "@/components/AssessmentRedirect"

interface DyslexiaAssessmentProps {
  onComplete: (result: any) => void
  onBack: () => void
}

export function DyslexiaAssessment({ onComplete, onBack }: DyslexiaAssessmentProps) {
  const [step, setStep] = useState(0)
  const [readingSpeed, setReadingSpeed] = useState(0)
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>(new Array(5).fill(-1))
  const [isReading, setIsReading] = useState(false)
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comprehensionAnswers, setComprehensionAnswers] = useState<number[]>(new Array(3).fill(-1))
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const [isComplete, setIsComplete] = useState(false)

  const testText = "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Reading speed and comprehension are important factors in assessing dyslexia. The ability to process written information quickly and accurately varies among individuals. Some people find it challenging to distinguish between similar-looking letters like 'b' and 'd' or 'p' and 'q'."
  
  const comprehensionQuestions = [
    {
      question: "What animal jumps over the dog?",
      options: ["Cat", "Fox", "Rabbit", "Horse"],
      correct: 1
    },
    {
      question: "What type of sentence is mentioned in the text?",
      options: ["Palindrome", "Pangram", "Anagram", "Acronym"],
      correct: 1
    },
    {
      question: "Which letter pairs are mentioned as challenging to distinguish?",
      options: ["a/e and i/o", "b/d and p/q", "m/n and r/s", "f/t and h/k"],
      correct: 1
    }
  ]
  
  const surveyQuestions = [
    "I often confuse similar looking letters or words when reading",
    "I have difficulty reading aloud smoothly",
    "I need to re-read sentences or paragraphs to understand them",
    "I find it hard to sound out unfamiliar words",
    "Reading feels more tiring for me than for others"
  ]

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
      const avgSurveyScore = surveyAnswers.reduce((sum, score) => sum + score, 0) / surveyAnswers.length
      const comprehensionScore = comprehensionAnswers.reduce((sum, answer, index) => {
        return sum + (answer === comprehensionQuestions[index].correct ? 1 : 0)
      }, 0) / comprehensionQuestions.length
      
      const result = await apiService.predictDyslexia({
        reading_speed: readingSpeed,
        survey_score: avgSurveyScore,
        comprehension_score: comprehensionScore
      })
      
      // Store result and redirect immediately
      localStorage.setItem('assessmentResults', JSON.stringify({ dyslexia: result }))
      window.location.href = '/text-adaptation'
    } catch (error) {
      console.error('Dyslexia assessment failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((step + 1) / 4) * 100



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
                <p className="text-lg leading-relaxed" style={{
                  fontFamily: '"OpenDyslexic", Arial, sans-serif',
                  lineHeight: '2.0',
                  letterSpacing: '0.1em'
                }}>
                  {testText.split('').map((char, index) => {
                    const isConfusingLetter = ['b', 'd', 'p', 'q'].includes(char.toLowerCase())
                    return (
                      <span 
                        key={index} 
                        className={isConfusingLetter ? 'bg-yellow-200 px-1 rounded font-bold' : ''}
                      >
                        {char}
                      </span>
                    )
                  })}
                </p>
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
        ) : step === 1 ? (
          <div>
            <h3 className="text-lg font-medium mb-4">Reading Comprehension</h3>
            <div className="space-y-6">
              {comprehensionQuestions.map((q, qIndex) => (
                <div key={qIndex} className="space-y-3">
                  <p className="font-medium">{q.question}</p>
                  <RadioGroup 
                    value={comprehensionAnswers[qIndex].toString()} 
                    onValueChange={(v) => {
                      const newAnswers = [...comprehensionAnswers]
                      newAnswers[qIndex] = parseInt(v)
                      setComprehensionAnswers(newAnswers)
                    }}
                  >
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}_${oIndex}`} />
                        <Label htmlFor={`q${qIndex}_${oIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-4">Survey Questions</h3>
            <div className="space-y-6">
              {surveyQuestions.map((question, qIndex) => (
                <div key={qIndex} className="space-y-3">
                  <p className="font-medium">{question}</p>
                  <RadioGroup 
                    value={surveyAnswers[qIndex].toString()} 
                    onValueChange={(v) => {
                      const newAnswers = [...surveyAnswers]
                      newAnswers[qIndex] = parseFloat(v)
                      setSurveyAnswers(newAnswers)
                    }}
                  >
                    {[
                      { value: "0", label: "Never" },
                      { value: "0.25", label: "Rarely" },
                      { value: "0.5", label: "Sometimes" },
                      { value: "0.75", label: "Often" },
                      { value: "1", label: "Always" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`survey_${qIndex}_${option.value}`} />
                        <Label htmlFor={`survey_${qIndex}_${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
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
          ) : step === 1 ? (
            <Button onClick={() => setStep(2)} disabled={comprehensionAnswers.includes(-1)}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={surveyAnswers.includes(-1) || isSubmitting}
              type="button"
            >
              {isSubmitting ? "Submitting..." : "Complete Assessment"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}