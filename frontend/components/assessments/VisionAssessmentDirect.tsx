"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AssessmentRedirect } from "@/components/AssessmentRedirect"

interface VisionAssessmentDirectProps {
  onComplete: (result: any) => void
  onBack: () => void
}

export function VisionAssessmentDirect({ onComplete, onBack }: VisionAssessmentDirectProps) {
  const [assessmentType, setAssessmentType] = useState("")
  const [eyePower, setEyePower] = useState("")
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = () => {
    let level = "normal"
    let preset = 2
    
    if (assessmentType === "eye_power") {
      const power = parseFloat(eyePower)
      if (power >= 6.0) {
        level = "severe"
        preset = 0
      } else if (power >= 2.0) {
        level = "moderate" 
        preset = 1
      } else if (power >= 0.5) {
        level = "mild"
        preset = 2
      }
    } else {
      level = assessmentType
      preset = assessmentType === "severe" ? 0 : assessmentType === "moderate" ? 1 : 2
    }
    
    const result = {
      level: level,
      severity: level,
      confidence: 1.0,
      preset: preset,
      recommendations: [
        level === "severe" ? "Use maximum font size and high contrast" : 
        level === "moderate" ? "Increase font size and adjust contrast" :
        "Standard settings with minor adjustments"
      ]
    }
    
    // Store result and redirect immediately
    localStorage.setItem('assessmentResults', JSON.stringify({ vision: result }))
    window.location.href = '/text-adaptation'
  }



  return (
    <Card>
      <CardHeader>
        <CardTitle>Vision Assessment</CardTitle>
        <CardDescription>Select your vision level for reading</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">How would you like to assess your vision?</h3>
            <RadioGroup value={assessmentType} onValueChange={setAssessmentType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="eye_power" id="eye_power" />
                <Label htmlFor="eye_power">Enter Eye Power (Diopter)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normal Vision - No reading difficulties</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mild" id="mild" />
                <Label htmlFor="mild">Mild Vision Issues - Slight reading difficulties</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate">Moderate Vision Issues - Need larger text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="severe" />
                <Label htmlFor="severe">Severe Vision Issues - Need high contrast and large text</Label>
              </div>
            </RadioGroup>
          </div>
          
          {assessmentType === "eye_power" && (
            <div>
              <Label htmlFor="eyePower" className="text-sm font-medium">Eye Power (Diopter)</Label>
              <Input
                id="eyePower"
                type="number"
                step="0.25"
                min="0"
                max="20"
                value={eyePower}
                onChange={(e) => setEyePower(e.target.value)}
                placeholder="e.g., 2.5"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your glasses/contact lens power. Higher numbers indicate stronger prescription.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!assessmentType || (assessmentType === "eye_power" && !eyePower)}
            type="button"
          >
            Complete Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}