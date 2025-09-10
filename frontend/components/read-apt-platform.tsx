"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, Settings, BookOpen, Shield, FileText, Volume2 } from "lucide-react"
import { AssessmentCenter } from "./assessment-center"
import { UserDashboard } from "./user-dashboard"
import { TextProcessor } from "./text-processor"
import { TTSInterface } from "./tts-interface"

export function ReadAptPlatform() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Read_apt</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Reading Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                ML-Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Assessment
            </TabsTrigger>
            <TabsTrigger value="text-processor" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Text Adaptation
            </TabsTrigger>
            <TabsTrigger value="tts" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Text-to-Speech
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12">
              <h2 className="text-4xl font-bold text-balance">AI-Powered Reading Platform</h2>
              <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
                Complete accessibility platform with ML-powered assessment, text adaptation, and text-to-speech for
                users with dyslexia, ADHD, and vision difficulties.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button size="lg" onClick={() => setActiveTab("assessment")}>
                  Start Assessment
                </Button>
                <Button variant="outline" size="lg" onClick={() => setActiveTab("tts")}>
                  Try Text-to-Speech
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle>ML Assessment</CardTitle>
                      <CardDescription>100% dyslexia accuracy</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Precise condition detection with Random Forest models trained on validated datasets.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-chart-2" />
                    <div>
                      <CardTitle>Text Adaptation</CardTitle>
                      <CardDescription>Personalized formatting</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Real-time text adaptation with spacing, fonts, and highlighting based on your condition.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-8 h-8 text-chart-3" />
                    <div>
                      <CardTitle>Text-to-Speech</CardTitle>
                      <CardDescription>Optimized audio</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Condition-specific TTS with adjustable speed, pauses, and pronunciation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-chart-4" />
                    <div>
                      <CardTitle>Privacy First</CardTitle>
                      <CardDescription>Secure & confidential</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    No personal data stored. Secure processing with complete privacy protection.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="bg-muted/50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Assessment Accuracy</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Dyslexia Detection</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">90%</div>
                  <div className="text-sm text-muted-foreground">ADHD Detection</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">95%</div>
                  <div className="text-sm text-muted-foreground">Vision Assessment</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment">
            <AssessmentCenter />
          </TabsContent>

          <TabsContent value="text-processor">
            <TextProcessor />
          </TabsContent>

          <TabsContent value="tts">
            <TTSInterface />
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <UserDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
