"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Eye, Settings } from "lucide-react"

interface UserConditions {
  dyslexia?: { severity: string; score: number }
  adhd?: { type: string; score: number }
  vision?: { level: string; power: number }
}

interface UserProfileProps {
  onAdaptText?: (conditions: UserConditions) => void
}

export function UserProfile({ onAdaptText }: UserProfileProps) {
  const [conditions, setConditions] = useState<UserConditions>({})
  const [hasConditions, setHasConditions] = useState(false)

  useEffect(() => {
    const results = localStorage.getItem("assessmentResults")
    if (results) {
      try {
        const parsed = JSON.parse(results)
        const userConditions: UserConditions = {}
      
      if (parsed.dyslexia && parsed.dyslexia.severity !== 'normal') {
        userConditions.dyslexia = parsed.dyslexia
      }
      if (parsed.adhd && parsed.adhd.type !== 'normal') {
        userConditions.adhd = parsed.adhd
      }
      if (parsed.vision && parsed.vision.level !== 'normal') {
        userConditions.vision = parsed.vision
      }
      
        setConditions(userConditions)
        setHasConditions(Object.keys(userConditions).length > 0)
      } catch (error) {
        console.error('Failed to parse assessment results:', error)
        localStorage.removeItem('assessmentResults')
      }
    }
  }, [])

  const getAdaptationSummary = () => {
    const adaptations = []
    
    if (conditions.dyslexia) {
      adaptations.push(`Heavy spacing (${conditions.dyslexia.severity} dyslexia)`)
    }
    if (conditions.adhd) {
      adaptations.push(`Text chunking (${conditions.adhd.type} ADHD)`)
    }
    if (conditions.vision) {
      adaptations.push(`Large text (${conditions.vision.level} vision)`)
    }
    
    return adaptations
  }

  if (!hasConditions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Conditions Detected</CardTitle>
          <CardDescription>Complete assessments to get personalized adaptations</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Your Accessibility Profile
        </CardTitle>
        <CardDescription>
          {Object.keys(conditions).length} condition(s) detected - adaptations applied
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {conditions.dyslexia && (
            <Badge variant="default" className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              Dyslexia ({conditions.dyslexia.severity})
            </Badge>
          )}
          {conditions.adhd && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              ADHD ({conditions.adhd.type})
            </Badge>
          )}
          {conditions.vision && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Vision ({conditions.vision.level})
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Active Adaptations:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {getAdaptationSummary().map((adaptation, i) => (
              <li key={i}>• {adaptation}</li>
            ))}
          </ul>
        </div>

        {onAdaptText && (
          <Button onClick={() => onAdaptText(conditions)} className="w-full">
            Apply Adaptations to Text
          </Button>
        )}
      </CardContent>
    </Card>
  )
}