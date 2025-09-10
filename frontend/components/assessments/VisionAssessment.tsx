"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiService } from "@/services/api"

interface VisionAssessmentProps {
  onComplete: (result: any) => void
  onBack: () => void
}

export function VisionAssessment({ onComplete, onBack }: VisionAssessmentProps) {
  const [glassesPower, setGlassesPower] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await apiService.classifyVision({
        glasses_power: parseFloat(glassesPower) || 0
      })
      onComplete(result)
    } catch (error) {
      console.error('Vision assessment failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vision Assessment</CardTitle>
        <CardDescription>Glasses prescription power evaluation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Glasses Prescription</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="glasses-power">
                What is your glasses prescription power? (Enter 0 if you don't wear glasses)
              </Label>
              <Input
                id="glasses-power"
                type="number"
                step="0.1"
                placeholder="e.g., -2.5, +1.0, or 0"
                value={glassesPower}
                onChange={(e) => setGlassesPower(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Examples:</p>
              <ul className="list-disc list-inside mt-1">
                <li>0 = No glasses needed</li>
                <li>-1.0 to -3.0 = Mild myopia (nearsightedness)</li>
                <li>-3.0+ = Moderate to severe myopia</li>
                <li>+1.0+ = Hyperopia (farsightedness)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          
          <Button onClick={handleSubmit} disabled={glassesPower === "" || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Complete Assessment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}