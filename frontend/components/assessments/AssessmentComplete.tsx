"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Eye, ArrowRight, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface AssessmentResults {
  dyslexia?: { severity: string; score: number }
  adhd?: { type: string; score: number }
  vision?: { level: string; power: number }
}

interface AssessmentCompleteProps {
  onRetakeAssessment?: () => void
}

export function AssessmentComplete({ onRetakeAssessment }: AssessmentCompleteProps) {
  const [results, setResults] = useState<AssessmentResults>({})
  const [hasResults, setHasResults] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedResults = localStorage.getItem("assessmentResults")
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults)
        setResults(parsed)
        setHasResults(true)
      } catch (error) {
        console.error('Failed to parse assessment results:', error)
        localStorage.removeItem("assessmentResults")
      }
    }
  }, [])

  const getConditionSummary = () => {
    const conditions = []
    
    if (results.dyslexia && results.dyslexia.severity !== 'normal') {
      conditions.push({
        name: 'Dyslexia',
        level: results.dyslexia.severity,
        icon: Brain,
        color: 'text-primary'
      })
    }
    
    if (results.adhd && results.adhd.type !== 'normal') {
      conditions.push({
        name: 'ADHD',
        level: results.adhd.type,
        icon: Zap,
        color: 'text-accent'
      })
    }
    
    if (results.vision && results.vision.level !== 'normal') {
      conditions.push({
        name: 'Vision',
        level: results.vision.level,
        icon: Eye,
        color: 'text-secondary'
      })
    }
    
    return conditions
  }

  const goToAdaptation = () => {
    router.push('/adaptation')
  }

  const goToTextTool = () => {
    router.push('/text-adaptation')
  }

  const conditions = getConditionSummary()

  if (!hasResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Assessment Results</CardTitle>
          <CardDescription>Complete assessments to see your results and get personalized adaptations</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRetakeAssessment}>Start Assessment</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✅ Assessment Complete!
          </CardTitle>
          <CardDescription>
            Your accessibility profile has been created based on your assessment results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {conditions.length > 0 ? (
            <div>
              <h4 className="font-semibold mb-3">Conditions Detected:</h4>
              <div className="space-y-2">
                {conditions.map((condition, i) => {
                  const Icon = condition.icon
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Icon className={`w-5 h-5 ${condition.color}`} />
                      <div className="flex-1">
                        <span className="font-medium">{condition.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {condition.level}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No specific accessibility needs detected</p>
              <p className="text-sm text-muted-foreground mt-1">
                You can still use our text adaptation tools for enhanced reading
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
          <CardDescription>Choose how you'd like to use your accessibility profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={goToTextTool} className="w-full justify-between" size="lg">
            <div className="flex items-center gap-2">
              <span>Try Text Adaptation Tool</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <Button onClick={goToAdaptation} variant="outline" className="w-full justify-between" size="lg">
            <div className="flex items-center gap-2">
              <span>View Adaptation Settings</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <Button onClick={onRetakeAssessment} variant="ghost" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Your Assessment Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground space-y-1">
            {results.dyslexia && (
              <p>Dyslexia: {results.dyslexia.severity} (Score: {results.dyslexia.score})</p>
            )}
            {results.adhd && (
              <p>ADHD: {results.adhd.type} (Score: {results.adhd.score})</p>
            )}
            {results.vision && (
              <p>Vision: {results.vision.level} (Power: {results.vision.power})</p>
            )}
            <p className="mt-2 text-xs">
              💾 Data stored locally in your browser - not saved to any server
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}