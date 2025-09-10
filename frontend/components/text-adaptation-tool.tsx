"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { apiService } from "@/services/api"
import { UserProfile } from "@/components/assessments/UserProfile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Settings2, Eye, Brain, Zap } from "lucide-react"

const sampleText = `Reading is a complex cognitive process that involves decoding symbols to derive meaning. For individuals with dyslexia, ADHD, or vision difficulties, traditional text formatting can present significant challenges. However, with proper adaptations such as increased spacing, dyslexia-friendly fonts, and high contrast colors, reading becomes much more accessible and enjoyable.`

export function TextAdaptationTool() {
  const [inputText, setInputText] = useState("")
  const [adaptedText, setAdaptedText] = useState("")
  const [fontSize, setFontSize] = useState([16])
  const [lineSpacing, setLineSpacing] = useState([1.5])
  const [letterSpacing, setLetterSpacing] = useState([0])
  const [fontFamily, setFontFamily] = useState("sans-serif")
  const [colorScheme, setColorScheme] = useState("default")
  const [isPlaying, setIsPlaying] = useState(false)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [isAdapting, setIsAdapting] = useState(false)
  const [userConditions, setUserConditions] = useState<any>(null)

  // Load user assessment results
  useEffect(() => {
    const results = localStorage.getItem('assessmentResults')
    if (results) {
      try {
        setUserConditions(JSON.parse(results))
      } catch (error) {
        console.error('Failed to parse assessment results:', error)
        localStorage.removeItem('assessmentResults')
      }
    }
  }, [])

  const displayText = adaptedText || inputText || sampleText

  // Real-time text adaptation using backend API for multiple conditions
  const adaptTextWithBackend = async (text: string, conditions: any) => {
    if (!text.trim()) return
    
    setIsAdapting(true)
    try {
      // Handle multiple conditions - user can have dyslexia + ADHD + vision issues
      const adaptationRequest = {
        text: text,
        preferences: {
          // Apply dyslexia adaptations if detected
          dyslexia_severity: conditions?.dyslexia?.severity || 'normal',
          // Apply ADHD adaptations if detected  
          adhd_type: conditions?.adhd?.type || 'normal',
          // Apply vision adaptations if detected
          vision_level: conditions?.vision?.level || 'normal',
          // Manual overrides
          font_size: fontSize[0],
          line_spacing: lineSpacing[0],
          letter_spacing: letterSpacing[0],
          color_scheme: colorScheme,
          // Combined conditions flag
          multiple_conditions: Object.keys(conditions || {}).length > 1
        }
      }
      
      const result = await apiService.adaptText(adaptationRequest)
      setAdaptedText(result.adapted_text || text)
    } catch (error) {
      console.error('Text adaptation failed:', error)
      setAdaptedText(text)
    } finally {
      setIsAdapting(false)
    }
  }

  // Auto-adapt when text or settings change
  useEffect(() => {
    if (inputText && userConditions) {
      const debounceTimer = setTimeout(() => {
        adaptTextWithBackend(inputText, userConditions)
      }, 500)
      return () => clearTimeout(debounceTimer)
    }
  }, [inputText, fontSize, lineSpacing, letterSpacing, colorScheme, userConditions])

  const presets = {
    dyslexia: {
      fontSize: [18],
      lineSpacing: [2.0],
      letterSpacing: [0.12],
      fontFamily: "dyslexic",
      colorScheme: "cream",
    },
    adhd: {
      fontSize: [16],
      lineSpacing: [1.8],
      letterSpacing: [0.05],
      fontFamily: "sans-serif",
      colorScheme: "blue-tint",
    },
    vision: {
      fontSize: [22],
      lineSpacing: [2.2],
      letterSpacing: [0.1],
      fontFamily: "sans-serif",
      colorScheme: "high-contrast",
    },
  }

  const applyPreset = async (preset: keyof typeof presets) => {
    const settings = presets[preset]
    setFontSize(settings.fontSize)
    setLineSpacing(settings.lineSpacing)
    setLetterSpacing(settings.letterSpacing)
    setFontFamily(settings.fontFamily)
    setColorScheme(settings.colorScheme)
    setActivePreset(preset)
    
    // Apply backend adaptation for this preset
    if (inputText) {
      const mockConditions = {
        dyslexia: { severity: preset === 'dyslexia' ? 'severe' : 'mild' },
        adhd: { type: preset === 'adhd' ? 'inattentive' : 'normal' },
        vision: { level: preset === 'vision' ? 'low_vision' : 'normal' }
      }
      await adaptTextWithBackend(inputText, mockConditions)
    }
  }

  const getAdaptedStyles = () => {
    const baseStyles: React.CSSProperties = {
      fontSize: `${fontSize[0]}px`,
      lineHeight: lineSpacing[0],
      letterSpacing: `${letterSpacing[0]}em`,
      fontFamily:
        fontFamily === "dyslexic"
          ? "OpenDyslexic, sans-serif"
          : fontFamily === "serif"
            ? "Georgia, serif"
            : "system-ui, sans-serif",
    }

    switch (colorScheme) {
      case "high-contrast":
        return { ...baseStyles, backgroundColor: "#000000", color: "#ffffff" }
      case "cream":
        return { ...baseStyles, backgroundColor: "#fdf6e3", color: "#5c4b37" }
      case "blue-tint":
        return { ...baseStyles, backgroundColor: "#f0f4ff", color: "#1e293b" }
      default:
        return { ...baseStyles, backgroundColor: "#ffffff", color: "#374151" }
    }
  }

  const handleTTS = async () => {
    if (isPlaying) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    try {
      // Use backend TTS service
      const ttsRequest = {
        text: displayText,
        voice: activePreset === 'dyslexia' ? 'slow' : activePreset === 'adhd' ? 'clear' : 'normal',
        speed: activePreset === 'dyslexia' ? 0.8 : activePreset === 'adhd' ? 0.9 : 1.0
      }
      
      await apiService.speakText(ttsRequest)
      setIsPlaying(true)
      
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(displayText)
      utterance.rate = ttsRequest.speed
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('TTS failed:', error)
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(displayText)
      utterance.rate = activePreset === "dyslexia" ? 0.7 : activePreset === "adhd" ? 0.9 : 0.8
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
      setIsPlaying(true)
    }
  }

  const resetSettings = () => {
    setFontSize([16])
    setLineSpacing([1.5])
    setLetterSpacing([0])
    setFontFamily("sans-serif")
    setColorScheme("default")
    setActivePreset(null)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Real-Time Text Adaptation</h2>
        <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
          Transform any text with 6+ accessibility features. Apply condition-specific presets or customize manually for
          optimal readability.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className={`cursor-pointer transition-all ${activePreset === "dyslexia" ? "ring-2 ring-primary" : ""}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>Dyslexia Preset</CardTitle>
                <p className="text-sm text-muted-foreground">Heavy spacing, dyslexic font</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => applyPreset("dyslexia")} className="w-full">
              Apply Dyslexia Settings
            </Button>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${activePreset === "adhd" ? "ring-2 ring-accent" : ""}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-accent" />
              <div>
                <CardTitle>ADHD Preset</CardTitle>
                <p className="text-sm text-muted-foreground">Chunking, focus mode</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => applyPreset("adhd")} className="w-full">
              Apply ADHD Settings
            </Button>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${activePreset === "vision" ? "ring-2 ring-secondary" : ""}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-secondary" />
              <div>
                <CardTitle>Vision Preset</CardTitle>
                <p className="text-sm text-muted-foreground">Large text, high contrast</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => applyPreset("vision")} className="w-full">
              Apply Vision Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Profile Section */}
      <UserProfile onAdaptText={(conditions) => adaptTextWithBackend(inputText || sampleText, conditions)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your text here, or use our sample text..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none"
                disabled={isAdapting}
              />
              {isAdapting && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  Adapting text with AI...
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setInputText(""); setAdaptedText("") }}>
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInputText(sampleText)}>
                  Use Sample
                </Button>
                {userConditions && (
                  <Button variant="outline" size="sm" onClick={() => adaptTextWithBackend(inputText || sampleText, userConditions)}>
                    Re-adapt
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Manual Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Font Size: {fontSize[0]}px</Label>
                <Slider value={fontSize} onValueChange={setFontSize} min={12} max={28} step={1} />
              </div>

              <div className="space-y-2">
                <Label>Line Spacing: {lineSpacing[0]}</Label>
                <Slider value={lineSpacing} onValueChange={setLineSpacing} min={1} max={3} step={0.1} />
              </div>

              <div className="space-y-2">
                <Label>Letter Spacing: {letterSpacing[0]}em</Label>
                <Slider value={letterSpacing} onValueChange={setLetterSpacing} min={0} max={0.3} step={0.01} />
              </div>

              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="dyslexic">OpenDyslexic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select value={colorScheme} onValueChange={setColorScheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="high-contrast">High Contrast</SelectItem>
                    <SelectItem value="cream">Cream</SelectItem>
                    <SelectItem value="blue-tint">Blue Tint</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetSettings} className="flex-1 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handleTTS} className="flex-1 bg-transparent">
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? "Pause" : "Listen"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Adapted Text Preview
                <div className="flex gap-2">
                  {activePreset && (
                    <Badge variant="default">
                      {activePreset.charAt(0).toUpperCase() + activePreset.slice(1)} Preset
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {fontFamily === "dyslexic" ? "Dyslexic Font" : fontFamily === "serif" ? "Serif Font" : "Sans Serif"}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-6 rounded-lg border min-h-[400px] transition-all duration-300"
                style={getAdaptedStyles()}
              >
                <p className="text-pretty">{displayText}</p>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Current Adaptation:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>Font Size: {fontSize[0]}px</div>
                  <div>Line Height: {lineSpacing[0]}</div>
                  <div>Letter Spacing: {letterSpacing[0]}em</div>
                  <div>Theme: {colorScheme}</div>
                </div>
                {adaptedText && adaptedText !== inputText && (
                  <div className="mt-2 text-xs text-green-600">
                    ✓ Text adapted with {adaptedText.length - (inputText?.length || 0)} additional accessibility features
                  </div>
                )}
                {userConditions && (
                  <div className="mt-2 text-xs text-blue-600">
                    Using your assessment: {userConditions.dyslexia?.severity || 'mild'} dyslexia, {userConditions.adhd?.type || 'normal'} ADHD, {userConditions.vision?.level || 'normal'} vision
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
