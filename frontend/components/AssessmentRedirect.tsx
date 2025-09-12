"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, FileText } from "lucide-react"

interface AssessmentRedirectProps {
  result: any
  assessmentType: "dyslexia" | "adhd" | "vision"
}

export function AssessmentRedirect({ result, assessmentType }: AssessmentRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    // Store assessment results in localStorage for text adaptation
    const results = { [assessmentType]: result }
    localStorage.setItem('assessmentResults', JSON.stringify(results))
  }, [result, assessmentType])

  const handleRedirectToTextAdaptation = () => {
    window.location.href = '/text-adaptation'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
        return 'destructive'
      case 'mild':
      case 'moderate':
        return 'secondary'
      case 'normal':
      case 'none':
        return 'default'
      default:
        return 'outline'
    }
  }

  const getRecommendations = () => {
    if (assessmentType === 'dyslexia') {
      return result.severity === 'severe' ? [
        'Use dyslexia-friendly fonts (OpenDyslexic)',
        'Enable letter highlighting for b/d and p/q',
        'Increase line spacing to 2.0 or higher',
        'Use text-to-speech for difficult passages',
        'Break text into smaller chunks'
      ] : result.severity === 'mild' ? [
        'Moderate line spacing adjustments',
        'Consider dyslexia-friendly fonts',
        'Use highlighting for confusing letters',
        'Take breaks during long reading sessions'
      ] : [
        'Continue with regular reading practices',
        'Monitor for any changes in reading comfort',
        'Use standard text formatting'
      ]
    } else if (assessmentType === 'adhd') {
      const adhdType = result.type || result.severity
      if (adhdType === 'combined') {
        return [
          'Use text chunking (3-4 sentences at a time)',
          'Enable word highlighting every 3rd word',
          'Use TL;DR summaries for long texts',
          'Enable text-to-speech for better focus',
          'Take frequent breaks'
        ]
      } else if (adhdType === 'inattentive') {
        return [
          'Highlight every 3rd word for focus',
          'Use clean, distraction-free layouts',
          'Break content into smaller sections',
          'Use bullet points and lists'
        ]
      } else if (adhdType === 'hyperactive') {
        return [
          'Use sentence chunking',
          'Enable TL;DR toggle',
          'Provide interactive elements',
          'Allow for movement breaks'
        ]
      } else {
        return [
          'Continue with standard reading practices',
          'Monitor attention levels during reading',
          'Use focus techniques as needed'
        ]
      }
    } else {
      // Vision
      return result.level === 'low_vision' ? [
        'Use high contrast color schemes',
        'Increase font size to 22px or larger',
        'Use maximum line spacing',
        'Enable zoom functionality',
        'Consider screen reader support'
      ] : [
        'Standard text formatting is sufficient',
        'Adjust brightness as needed',
        'Use comfortable reading distances'
      ]
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <CardTitle className="text-green-800">Assessment Complete!</CardTitle>
              <CardDescription className="text-green-700">
                Your {assessmentType} assessment has been successfully completed.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-medium">Result:</span>
              <Badge variant={getSeverityColor(result.severity || result.type || result.level)}>
                {result.severity || result.type || result.level || 'Normal'}
              </Badge>
              {result.confidence && (
                <span className="text-sm text-muted-foreground">
                  ({Math.round(result.confidence * 100)}% confidence)
                </span>
              )}
            </div>
            
            {result.preset !== undefined && (
              <div className="text-sm text-muted-foreground">
                Recommended preset: Level {result.preset}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>
            Based on your assessment, here are the recommended adaptations:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {getRecommendations().map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Ready to Adapt Your Text?
          </CardTitle>
          <CardDescription>
            Your assessment results have been saved. You can now paste or upload text to see it adapted to your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRedirectToTextAdaptation} className="w-full" size="lg">
            Go to Text Adaptation Tool
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Your assessment results are stored locally and will be used to personalize your reading experience.</p>
      </div>
    </div>
  )
}