"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Eye, Headphones } from "lucide-react"

interface LandingPageProps {
  onStartAssessment: () => void
}

export function LandingPage({ onStartAssessment }: LandingPageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">ReadApt</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
          Accessible Reading Platform for Everyone
        </p>
        <p className="text-lg text-foreground max-w-2xl mx-auto mb-8 text-pretty">
          Personalized text adaptations for individuals with dyslexia, ADHD, and vision difficulties. Take our
          5-question assessment to get started with customized reading support.
        </p>

        <Button
          onClick={onStartAssessment}
          size="lg"
          className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Start 5-question accessibility assessment"
        >
          Start Assessment
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-card border-border">
          <CardHeader className="text-center pb-4">
            <Brain className="w-12 h-12 text-primary mx-auto mb-2" aria-hidden="true" />
            <CardTitle className="text-lg">Smart Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-card-foreground">
              5-question evaluation to identify your specific reading challenges and preferences
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="text-center pb-4">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-2" aria-hidden="true" />
            <CardTitle className="text-lg">Text Adaptation</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-card-foreground">
              AI-powered formatting with customizable spacing, fonts, and highlighting options
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="text-center pb-4">
            <Headphones className="w-12 h-12 text-primary mx-auto mb-2" aria-hidden="true" />
            <CardTitle className="text-lg">Text-to-Speech</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-card-foreground">
              Natural voice synthesis optimized for different learning and accessibility needs
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="text-center pb-4">
            <Eye className="w-12 h-12 text-primary mx-auto mb-2" aria-hidden="true" />
            <CardTitle className="text-lg">Accessibility First</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-card-foreground">
              Designed specifically for dyslexia, ADHD, and vision difficulties with high contrast
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-muted border-border max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Improve Your Reading Experience?</h2>
            <p className="text-muted-foreground mb-6 text-pretty">
              Our quick assessment will help us understand your needs and provide personalized recommendations.
            </p>
            <Button
              onClick={onStartAssessment}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label="Begin accessibility assessment now"
            >
              Begin Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
