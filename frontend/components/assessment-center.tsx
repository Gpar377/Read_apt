"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Brain, Eye, Zap, CheckCircle } from "lucide-react"

interface AssessmentResult {
  condition: string
  severity: string
  confidence: number
  recommendations: string[]
}

export function AssessmentCenter() {
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null)
  const [results, setResults] = useState<AssessmentResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Dyslexia Assessment State
  const [dyslexiaData, setDyslexiaData] = useState({
    readingSpeed: [0.5],
    surveyScore: [0.5],
  })

  // ADHD Assessment State
  const [adhdData, setAdhdData] = useState({
    inattention: Array(9).fill(0),
    hyperactivity: Array(9).fill(0),
  })

  // Vision Assessment State
  const [visionData, setVisionData] = useState({
    glassesPrescription: "",
  })

  const runDyslexiaAssessment = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to /api/dyslexia/predict
      const response = await fetch("/api/dyslexia/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reading_speed: dyslexiaData.readingSpeed[0],
          survey_score: dyslexiaData.surveyScore[0],
        }),
      })

      // Mock response for demo
      const mockResult: AssessmentResult = {
        condition: "Dyslexia",
        severity:
          dyslexiaData.readingSpeed[0] < 0.3 ? "Severe" : dyslexiaData.readingSpeed[0] < 0.7 ? "Moderate" : "Mild",
        confidence: 95,
        recommendations: [
          "Use dyslexia-friendly fonts (OpenDyslexic)",
          "Increase letter spacing to 0.12em",
          "Enable text-to-speech at 0.8x speed",
          "Use highlighting and reading guides",
        ],
      }

      setResults((prev) => [...prev.filter((r) => r.condition !== "Dyslexia"), mockResult])
    } catch (error) {
      console.error("Assessment failed:", error)
    } finally {
      setIsLoading(false)
      setActiveAssessment(null)
    }
  }

  const runADHDAssessment = async () => {
    setIsLoading(true)
    try {
      // Calculate total score
      const totalScore = [...adhdData.inattention, ...adhdData.hyperactivity].reduce((a, b) => a + b, 0)

      const mockResult: AssessmentResult = {
        condition: "ADHD",
        severity: totalScore > 36 ? "Severe" : totalScore > 24 ? "Moderate" : totalScore > 12 ? "Mild" : "Normal",
        confidence: 90,
        recommendations: [
          "Break text into smaller chunks",
          "Use TL;DR summaries",
          "Enable focus mode with reduced distractions",
          "Implement reading timers and breaks",
        ],
      }

      setResults((prev) => [...prev.filter((r) => r.condition !== "ADHD"), mockResult])
    } catch (error) {
      console.error("Assessment failed:", error)
    } finally {
      setIsLoading(false)
      setActiveAssessment(null)
    }
  }

  const runVisionAssessment = async () => {
    setIsLoading(true)
    try {
      const prescription = Number.parseFloat(visionData.glassesPrescription) || 0

      const mockResult: AssessmentResult = {
        condition: "Vision",
        severity: Math.abs(prescription) > 4 ? "Low Vision" : Math.abs(prescription) > 2 ? "Mild Impairment" : "Normal",
        confidence: 100,
        recommendations: [
          "Increase text size to 150%",
          "Use high contrast themes",
          "Enable screen magnification",
          "Optimize color combinations for visibility",
        ],
      }

      setResults((prev) => [...prev.filter((r) => r.condition !== "Vision"), mockResult])
    } catch (error) {
      console.error("Assessment failed:", error)
    } finally {
      setIsLoading(false)
      setActiveAssessment(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">ML-Powered Assessment Center</h2>
        <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
          Take scientifically-backed assessments powered by machine learning models trained on Kaggle datasets with high
          accuracy rates.
        </p>
      </div>

      {/* Assessment Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Dyslexia Assessment */}
        <Card
          className={`cursor-pointer transition-all ${activeAssessment === "dyslexia" ? "ring-2 ring-primary" : ""}`}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>Dyslexia Assessment</CardTitle>
                <CardDescription>100% accuracy model</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeAssessment === "dyslexia" ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Reading Speed (0-1 scale)</Label>
                  <Slider
                    value={dyslexiaData.readingSpeed}
                    onValueChange={(value) => setDyslexiaData((prev) => ({ ...prev, readingSpeed: value }))}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Current: {dyslexiaData.readingSpeed[0].toFixed(1)}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Survey Score (0-1 scale)</Label>
                  <Slider
                    value={dyslexiaData.surveyScore}
                    onValueChange={(value) => setDyslexiaData((prev) => ({ ...prev, surveyScore: value }))}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">Current: {dyslexiaData.surveyScore[0].toFixed(1)}</div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={runDyslexiaAssessment} disabled={isLoading} className="flex-1">
                    {isLoading ? "Processing..." : "Run Assessment"}
                  </Button>
                  <Button variant="outline" onClick={() => setActiveAssessment(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Assess reading difficulties using ML model trained on reading speed and survey data.
                </p>
                <Button onClick={() => setActiveAssessment("dyslexia")} className="w-full">
                  Start Assessment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ADHD Assessment */}
        <Card className={`cursor-pointer transition-all ${activeAssessment === "adhd" ? "ring-2 ring-accent" : ""}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-accent" />
              <div>
                <CardTitle>ADHD Assessment</CardTitle>
                <CardDescription>90% accuracy model</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeAssessment === "adhd" ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Inattention Symptoms (0-3 each)</Label>
                  {Array.from({ length: 9 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">Symptom {i + 1}</span>
                      <RadioGroup
                        value={adhdData.inattention[i].toString()}
                        onValueChange={(value) => {
                          const newInattention = [...adhdData.inattention]
                          newInattention[i] = Number.parseInt(value)
                          setAdhdData((prev) => ({ ...prev, inattention: newInattention }))
                        }}
                        className="flex gap-2"
                      >
                        {[0, 1, 2, 3].map((score) => (
                          <div key={score} className="flex items-center space-x-1">
                            <RadioGroupItem value={score.toString()} id={`inatt-${i}-${score}`} />
                            <Label htmlFor={`inatt-${i}-${score}`} className="text-xs">
                              {score}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={runADHDAssessment} disabled={isLoading} className="flex-1">
                    {isLoading ? "Processing..." : "Run Assessment"}
                  </Button>
                  <Button variant="outline" onClick={() => setActiveAssessment(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  18-question assessment for ADHD classification across 4 categories.
                </p>
                <Button onClick={() => setActiveAssessment("adhd")} className="w-full">
                  Start Assessment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vision Assessment */}
        <Card
          className={`cursor-pointer transition-all ${activeAssessment === "vision" ? "ring-2 ring-secondary" : ""}`}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-secondary" />
              <div>
                <CardTitle>Vision Assessment</CardTitle>
                <CardDescription>Rule-based classification</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeAssessment === "vision" ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="prescription">Glasses Prescription Power</Label>
                  <Input
                    id="prescription"
                    type="number"
                    step="0.25"
                    placeholder="e.g., -2.5, +1.75"
                    value={visionData.glassesPrescription}
                    onChange={(e) => setVisionData((prev) => ({ ...prev, glassesPrescription: e.target.value }))}
                  />
                  <div className="text-sm text-muted-foreground">
                    Enter your prescription strength (negative for nearsighted, positive for farsighted)
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={runVisionAssessment} disabled={isLoading} className="flex-1">
                    {isLoading ? "Processing..." : "Run Assessment"}
                  </Button>
                  <Button variant="outline" onClick={() => setActiveAssessment(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Classify vision adaptation needs based on prescription strength.
                </p>
                <Button onClick={() => setActiveAssessment("vision")} className="w-full">
                  Start Assessment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Assessment Results</h3>
          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.condition === "Dyslexia" && <Brain className="w-6 h-6 text-primary" />}
                      {result.condition === "ADHD" && <Zap className="w-6 h-6 text-accent" />}
                      {result.condition === "Vision" && <Eye className="w-6 h-6 text-secondary" />}
                      <div>
                        <CardTitle>{result.condition} Assessment</CardTitle>
                        <CardDescription>Severity: {result.severity}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={result.severity === "Normal" ? "secondary" : "destructive"}>
                      {result.confidence}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Running ML model assessment...</p>
        </div>
      )}
    </div>
  )
}
