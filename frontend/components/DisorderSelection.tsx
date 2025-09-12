"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, Eye } from "lucide-react"

interface DisorderSelectionProps {
  onDisorderSelect: (disorder: "dyslexia" | "adhd" | "vision") => void
}

export function DisorderSelection({ onDisorderSelect }: DisorderSelectionProps) {
  const [selectedDisorder, setSelectedDisorder] = useState<string | null>(null)

  const disorders = [
    {
      id: "dyslexia",
      title: "Dyslexia",
      description: "Difficulty with reading, spelling, and word recognition",
      icon: Brain,
      color: "border-blue-500 hover:bg-blue-50",
      assessment: "Reading comprehension test + questionnaire"
    },
    {
      id: "adhd", 
      title: "ADHD",
      description: "Attention deficit hyperactivity disorder affecting focus",
      icon: Zap,
      color: "border-orange-500 hover:bg-orange-50",
      assessment: "18-question behavioral assessment"
    },
    {
      id: "vision",
      title: "Low Vision",
      description: "Visual impairments affecting reading ability", 
      icon: Eye,
      color: "border-green-500 hover:bg-green-50",
      assessment: "Direct input of vision level"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Select Your Reading Challenge</h1>
        <p className="text-xl text-muted-foreground">
          Choose the condition that best describes your reading difficulties
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {disorders.map((disorder) => {
          const Icon = disorder.icon
          const isSelected = selectedDisorder === disorder.id
          
          return (
            <Card 
              key={disorder.id}
              className={`cursor-pointer transition-all ${disorder.color} ${
                isSelected ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => setSelectedDisorder(disorder.id)}
            >
              <CardHeader className="text-center">
                <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl">{disorder.title}</CardTitle>
                <CardDescription className="text-sm">
                  {disorder.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <strong>Assessment:</strong> {disorder.assessment}
                  </div>
                  <Button 
                    className="w-full" 
                    variant={isSelected ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDisorderSelect(disorder.id as "dyslexia" | "adhd" | "vision")
                    }}
                  >
                    {isSelected ? "Start Assessment" : "Select"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>You can only select one condition at a time for the most accurate assessment.</p>
      </div>
    </div>
  )
}