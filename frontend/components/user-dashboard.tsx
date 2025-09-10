"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { User, Settings, Clock, Target, TrendingUp, Brain, Eye, Zap, BookOpen, Palette } from "lucide-react"

interface UserProfile {
  name: string
  conditions: string[]
  readingSpeed: number
  comprehensionScore: number
  sessionsCompleted: number
  totalReadingTime: number
}

export function UserDashboard() {
  const [profile] = useState<UserProfile>({
    name: "Alex Johnson",
    conditions: ["Dyslexia", "ADHD"],
    readingSpeed: 185, // words per minute
    comprehensionScore: 87,
    sessionsCompleted: 24,
    totalReadingTime: 1440, // minutes
  })

  const [preferences, setPreferences] = useState({
    autoTTS: true,
    highlightMode: true,
    darkMode: false,
    notifications: true,
    autoSave: true,
  })

  const recentSessions = [
    { date: "2024-01-15", duration: 25, wordsRead: 1200, comprehension: 92 },
    { date: "2024-01-14", duration: 18, wordsRead: 890, comprehension: 85 },
    { date: "2024-01-13", duration: 32, wordsRead: 1450, comprehension: 89 },
    { date: "2024-01-12", duration: 22, wordsRead: 1100, comprehension: 91 },
  ]

  const adaptationSettings = [
    { name: "Font Size", value: "18px", condition: "Vision" },
    { name: "Line Spacing", value: "2.0", condition: "Dyslexia" },
    { name: "Letter Spacing", value: "0.12em", condition: "Dyslexia" },
    { name: "Text Chunking", value: "Enabled", condition: "ADHD" },
    { name: "TTS Speed", value: "0.8x", condition: "Dyslexia" },
    { name: "Color Scheme", value: "Cream", condition: "Vision" },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Personal Dashboard</h2>
        <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
          Track your reading progress, manage preferences, and view personalized insights from your accessibility
          journey.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="adaptations">Adaptations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription>Active since January 2024</CardDescription>
                  <div className="flex gap-2 mt-2">
                    {profile.conditions.map((condition) => (
                      <Badge key={condition} variant="secondary">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <CardTitle className="text-sm">Reading Speed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.readingSpeed} WPM</div>
                <div className="text-sm text-muted-foreground">+12% this month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  <CardTitle className="text-sm">Comprehension</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.comprehensionScore}%</div>
                <div className="text-sm text-muted-foreground">+5% this month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  <CardTitle className="text-sm">Sessions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.sessionsCompleted}</div>
                <div className="text-sm text-muted-foreground">This month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-chart-2" />
                  <CardTitle className="text-sm">Total Time</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(profile.totalReadingTime / 60)}h</div>
                <div className="text-sm text-muted-foreground">Reading time</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reading Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <div className="font-medium">{session.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {session.duration} min • {session.wordsRead} words
                        </div>
                      </div>
                    </div>
                    <Badge variant={session.comprehension >= 90 ? "default" : "secondary"}>
                      {session.comprehension}% comprehension
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reading Speed Progress</CardTitle>
                <CardDescription>Words per minute over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Current: {profile.readingSpeed} WPM</span>
                    <span>Goal: 200 WPM</span>
                  </div>
                  <Progress value={(profile.readingSpeed / 200) * 100} />
                  <div className="text-sm text-muted-foreground">You're 92% of the way to your goal!</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comprehension Trends</CardTitle>
                <CardDescription>Understanding accuracy over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Current: {profile.comprehensionScore}%</span>
                    <span>Goal: 90%</span>
                  </div>
                  <Progress value={profile.comprehensionScore} />
                  <div className="text-sm text-muted-foreground">Excellent comprehension! Keep it up.</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Condition-Specific Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Dyslexia Adaptations</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reading fluency</span>
                      <span>+18%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Error reduction</span>
                      <span>+25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Reading confidence</span>
                      <span>+30%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    <h4 className="font-semibold">ADHD Support</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Focus duration</span>
                      <span>+22%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Distraction resistance</span>
                      <span>+15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Task completion</span>
                      <span>+28%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-tts">Auto Text-to-Speech</Label>
                  <p className="text-sm text-muted-foreground">Automatically start TTS when opening text</p>
                </div>
                <Switch
                  id="auto-tts"
                  checked={preferences.autoTTS}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, autoTTS: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="highlight-mode">Smart Highlighting</Label>
                  <p className="text-sm text-muted-foreground">Highlight text as you read</p>
                </div>
                <Switch
                  id="highlight-mode"
                  checked={preferences.highlightMode}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, highlightMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme for reduced eye strain</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, darkMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Progress Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get updates on your reading progress</p>
                </div>
                <Switch
                  id="notifications"
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Auto-Save Settings</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your adaptation preferences</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, autoSave: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adaptations Tab */}
        <TabsContent value="adaptations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Current Adaptations
              </CardTitle>
              <CardDescription>Your personalized settings based on assessment results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {adaptationSettings.map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{setting.name}</div>
                      <div className="text-sm text-muted-foreground">For {setting.condition}</div>
                    </div>
                    <Badge variant="outline">{setting.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Dyslexia Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Severity</span>
                    <Badge variant="secondary">Moderate</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Font</span>
                    <span>OpenDyslexic</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TTS Speed</span>
                    <span>0.8x</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <CardTitle className="text-lg">ADHD Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Severity</span>
                    <Badge variant="secondary">Mild</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Chunking</span>
                    <span>Enabled</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Focus Mode</span>
                    <span>Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-secondary" />
                  <CardTitle className="text-lg">Vision Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Status</span>
                    <Badge variant="secondary">Normal</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Text Size</span>
                    <span>18px</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Contrast</span>
                    <span>Standard</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
