"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Home, Settings, ArrowRight } from "lucide-react"
import { apiService } from "@/services/api"
import { useRouter } from "next/navigation"

// ADHD Assessment - 18 questions (0-3 scale each)
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

const assessmentSteps = [
  {
    type: 'dyslexia_speed',
    title: 'Reading Speed Assessment',
    question: 'Please read this text aloud and we\'ll measure your reading speed:',
    text: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice.',
    isTimedReading: true
  },
  {
    type: 'dyslexia_survey', 
    title: 'Dyslexia Survey',
    question: 'Rate your agreement with this statement: "I often confuse similar looking letters or words when reading"',
    options: [
      { value: "0", label: "Strongly Disagree" },
      { value: "0.25", label: "Disagree" },
      { value: "0.5", label: "Neutral" },
      { value: "0.75", label: "Agree" },
      { value: "1", label: "Strongly Agree" }
    ]
  },
  {
    type: 'vision_glasses',
    title: 'Vision Assessment', 
    question: 'What is your glasses prescription power? (Enter 0 if you don\'t wear glasses)',
    isNumberInput: true,
    placeholder: 'e.g., -2.5, +1.0, or 0'
  }
]

export const AssessmentForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentADHDQuestion, setCurrentADHDQuestion] = useState(0)
  const [assessmentData, setAssessmentData] = useState({
    readingSpeed: 0,
    surveyScore: 0,
    adhdAnswers: new Array(18).fill(0),
    glassesPower: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  const totalSteps = assessmentSteps.length + adhdQuestions.length
  const currentStepIndex = currentStep < assessmentSteps.length ? currentStep : assessmentSteps.length + currentADHDQuestion
  const progress = ((currentStepIndex + 1) / totalSteps) * 100

  const handleAnswerChange = (value: string) => {
    if (currentStep < assessmentSteps.length) {
      const step = assessmentSteps[currentStep]
      if (step.type === 'dyslexia_survey') {
        setAssessmentData(prev => ({ ...prev, surveyScore: parseFloat(value) }))
      } else if (step.type === 'vision_glasses') {
        setAssessmentData(prev => ({ ...prev, glassesPower: parseFloat(value) || 0 }))
      }
    } else {
      // ADHD questions
      const newAnswers = [...assessmentData.adhdAnswers]
      newAnswers[currentADHDQuestion] = parseInt(value)
      setAssessmentData(prev => ({ ...prev, adhdAnswers: newAnswers }))
    }
  }

  const startReadingTest = () => {
    setIsReading(true)
    setReadingStartTime(Date.now())
  }

  const finishReadingTest = () => {
    if (readingStartTime) {
      const readingTime = (Date.now() - readingStartTime) / 1000 // seconds
      const wordsInText = 19 // word count in test text
      const wpm = (wordsInText / readingTime) * 60
      const normalizedSpeed = Math.min(wpm / 200, 1) // normalize to 0-1 scale (200 WPM = 1.0)
      setAssessmentData(prev => ({ ...prev, readingSpeed: normalizedSpeed }))
      setIsReading(false)
      setReadingStartTime(null)
    }
  }

  const handleNext = () => {
    if (currentStep < assessmentSteps.length) {
      setCurrentStep(currentStep + 1)
    } else if (currentADHDQuestion < adhdQuestions.length - 1) {
      setCurrentADHDQuestion(currentADHDQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0 && currentADHDQuestion === 0) {
      setCurrentStep(currentStep - 1)
    } else if (currentADHDQuestion > 0) {
      setCurrentADHDQuestion(currentADHDQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Prepare data for real ML models
      const dyslexiaData = {
        reading_speed: assessmentData.readingSpeed,
        survey_score: assessmentData.surveyScore
      }
      
      const adhdData = {
        answers: assessmentData.adhdAnswers
      }
      
      const visionData = {
        glasses_power: assessmentData.glassesPower
      }

      // Call real ML model endpoints
      const [dyslexiaResult, adhdResult, visionResult] = await Promise.all([
        apiService.predictDyslexia(dyslexiaData),
        apiService.predictADHD(adhdData), 
        apiService.classifyVision(visionData),
      ])

      // Store results
      localStorage.setItem(
        "assessmentResults",
        JSON.stringify({
          dyslexia: dyslexiaResult,
          adhd: adhdResult,
          vision: visionResult,
          rawData: assessmentData,
        }),
      )

      // Show completion message with navigation options
      const completionData = {
        dyslexia: dyslexiaResult,
        adhd: adhdResult,
        vision: visionResult,
        rawData: assessmentData,
      }
      
      localStorage.setItem("assessmentResults", JSON.stringify(completionData))
      
      // Set completion state to show success message
      setIsCompleted(true)
    } catch (error) {
      console.error("Assessment submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLastQuestion = currentStep >= assessmentSteps.length && currentADHDQuestion === adhdQuestions.length - 1
  const canProceed = () => {
    if (currentStep < assessmentSteps.length) {
      const step = assessmentSteps[currentStep]
      if (step.type === 'dyslexia_speed') return assessmentData.readingSpeed > 0
      if (step.type === 'dyslexia_survey') return assessmentData.surveyScore >= 0
      if (step.type === 'vision_glasses') return true // always can proceed
    }
    return assessmentData.adhdAnswers[currentADHDQuestion] >= 0
  }

  // Show completion screen
  if (isCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-green-600">Assessment Complete! 🎉</CardTitle>
          <CardDescription className="text-center">
            Your reading assessment has been completed successfully. You can now use the text adaptation tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Based on your assessment, we've personalized your reading experience. 
              You can now access the text adaptation tools with your custom settings.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.push("/text-adaptation")}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Continue to Text Tool
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {currentStep < assessmentSteps.length 
                ? assessmentSteps[currentStep].title
                : ADHD Question ${currentADHDQuestion + 1} of ${adhdQuestions.length}
              }
            </CardTitle>
            <CardDescription>
              {currentStep < assessmentSteps.length 
                ? "Complete each assessment step"
                : "Rate how often this applies to you (0=Never, 3=Very Often)"
              }
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
        </div>
        <Progress value={progress} className="mt-4" />
        
        {/* Navigation Options */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/text-adaptation")}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Continue to Text Tool
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          {currentStep < assessmentSteps.length ? (
            <div>
              <h3 className="text-lg font-medium mb-4">{assessmentSteps[currentStep].question}</h3>
              
              {assessmentSteps[currentStep].isTimedReading ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-lg leading-relaxed">{assessmentSteps[currentStep].text}</p>
                  </div>
                  {!isReading && assessmentData.readingSpeed === 0 && (
                    <Button onClick={startReadingTest}>Start Reading Test</Button>
                  )}
                  {isReading && (
                    <Button onClick={finishReadingTest} variant="destructive">Finished Reading</Button>
                  )}
                  {assessmentData.readingSpeed > 0 && (
                    <p className="text-green-600">✓ Reading speed recorded</p>
                  )}
                </div>
              ) : assessmentSteps[currentStep].isNumberInput ? (
                <Input 
                  type="number" 
                  step="0.1"
                  placeholder={assessmentSteps[currentStep].placeholder}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                />
              ) : (
                <RadioGroup value={assessmentData.surveyScore.toString()} onValueChange={handleAnswerChange} className="space-y-3">
                  {assessmentSteps[currentStep].options?.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">{adhdQuestions[currentADHDQuestion]}</h3>
              <RadioGroup 
                value={assessmentData.adhdAnswers[currentADHDQuestion].toString()} 
                onValueChange={handleAnswerChange} 
                className="space-y-3"
              >
                {["0", "1", "2", "3"].map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="flex-1 cursor-pointer">
                      {["Never", "Sometimes", "Often", "Very Often"][parseInt(value)]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0 && currentADHDQuestion === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Complete Assessment"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}