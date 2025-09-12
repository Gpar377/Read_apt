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
import { Play, Pause, RotateCcw, Settings2, Eye, Brain, Zap, Sparkles } from "lucide-react"
import { ADHDTextRenderer } from "@/components/ADHDTextRenderer"
import { DyslexiaTextRenderer } from "@/components/DyslexiaTextRenderer"
import { AIBehaviorAgent } from "@/components/AIBehaviorAgent"

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
  const [showSummary, setShowSummary] = useState(false)
  const [summary, setSummary] = useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [userDisorder, setUserDisorder] = useState<string | null>(null)

  // Load user assessment results
  useEffect(() => {
    const results = localStorage.getItem('assessmentResults')
    if (results) {
      try {
        const parsedResults = JSON.parse(results)
        setUserConditions(parsedResults)
        
        // Determine primary disorder
        if (parsedResults.dyslexia) setUserDisorder('dyslexia')
        else if (parsedResults.adhd) setUserDisorder('adhd')
        else if (parsedResults.vision) setUserDisorder('vision')
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
      // Use browser TTS with female voice
      const utterance = new SpeechSynthesisUtterance(displayText)
      
      // Set female voice
      const voices = speechSynthesis.getVoices()
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('hazel')
      ) || voices.find(voice => voice.gender === 'female')
      
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }
      
      utterance.rate = userDisorder === 'dyslexia' ? 0.7 : userDisorder === 'adhd' ? 0.9 : 0.8
      utterance.pitch = 1.1
      utterance.volume = 1.0
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      
      speechSynthesis.speak(utterance)
      setIsPlaying(true)
    } catch (error) {
      console.error('TTS failed:', error)
      setIsPlaying(false)
    }
  }
  
  const generateSummary = async () => {
    setIsGeneratingSummary(true)
    try {
      const summaryType = activePreset === 'adhd' ? 'adhd' : 'general'
      const result = await apiService.generateSummary(displayText, summaryType, 100)
      
      if (result.success) {
        setSummary(result.summary)
        setShowSummary(true)
      } else {
        setSummary("Summary generation failed. Please try again.")
        setShowSummary(true)
      }
    } catch (error) {
      console.error('Summary generation failed:', error)
      setSummary("Summary generation failed. Please try again.")
      setShowSummary(true)
    } finally {
      setIsGeneratingSummary(false)
    }
  }
  
  const handleAISuggestion = (action: string) => {
    switch (action) {
      case 'increase_line_spacing':
        setLineSpacing([Math.min(lineSpacing[0] + 0.2, 3)])
        break
      case 'enable_tts':
        handleTTS()
        break
      case 'increase_font_size':
        setFontSize([Math.min(fontSize[0] + 2, 28)])
        break
      case 'summarize_text':
      case 'generate_summary':
        generateSummary()
        break
      case 'increase_spacing':
        setLetterSpacing([Math.min(letterSpacing[0] + 0.05, 0.3)])
        break
      case 'chunk_text':
        if (activePreset !== 'adhd') {
          applyPreset('adhd')
        }
        break
      case 'highlight_keywords':
      case 'highlight_confusing_letters':
        if (activePreset !== 'dyslexia') {
          applyPreset('dyslexia')
        }
        break
      case 'dyslexic_font':
        setFontFamily('dyslexic')
        break
      case 'high_contrast':
        setColorScheme('high-contrast')
        break
      case 'increase_zoom':
        setFontSize([Math.min(fontSize[0] + 4, 28)])
        break
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
        <h2 className="text-3xl font-bold">Text Adaptation Tool</h2>
        {userDisorder && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-800 capitalize">
              {userDisorder} Adaptation Active
            </h3>
            <p className="text-blue-700 text-sm">
              {userDisorder === 'dyslexia' && 'Letter highlighting and dyslexia-friendly formatting enabled'}
              {userDisorder === 'adhd' && 'Word highlighting and chunking features available'}
              {userDisorder === 'vision' && 'High contrast and large text options enabled'}
            </p>
          </div>
        )}
      </div>

      {/* Disorder-Specific Preset */}
      {userDisorder && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              {userDisorder === 'dyslexia' && <Brain className="w-8 h-8 text-primary" />}
              {userDisorder === 'adhd' && <Zap className="w-8 h-8 text-primary" />}
              {userDisorder === 'vision' && <Eye className="w-8 h-8 text-primary" />}
              <div>
                <CardTitle className="capitalize">{userDisorder} Preset</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {userDisorder === 'dyslexia' && 'Letter highlighting, dyslexic font, increased spacing'}
                  {userDisorder === 'adhd' && 'Word highlighting, text chunking, summarization'}
                  {userDisorder === 'vision' && 'Large text, high contrast, maximum spacing'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => applyPreset(userDisorder)} className="w-full">
              Apply {userDisorder.charAt(0).toUpperCase() + userDisorder.slice(1)} Settings
            </Button>
          </CardContent>
        </Card>
      )}

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
                  {isPlaying ? "Stop" : "Listen (Female Voice)"}
                </Button>
              </div>
              
              {/* Disorder-specific features */}
              {userDisorder === 'adhd' && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateSummary} 
                    disabled={isGeneratingSummary}
                    className="w-full"
                  >
                    {isGeneratingSummary ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate TL;DR
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {userDisorder === 'vision' && (
                <div className="mt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setColorScheme('high-contrast')}
                    className="w-full"
                  >
                    High Contrast Mode
                  </Button>
                </div>
              )}
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
              {userDisorder === 'adhd' ? (
                <ADHDTextRenderer 
                  text={displayText}
                  preset={userConditions?.adhd?.type === 'combined' ? 'combined' : 
                          userConditions?.adhd?.type === 'hyperactive' ? 'hyperactive' : 
                          userConditions?.adhd?.type === 'inattentive' ? 'inattentive' : 'normal'}
                  onSummarize={generateSummary}
                />
              ) : userDisorder === 'dyslexia' ? (
                <DyslexiaTextRenderer 
                  text={displayText}
                  severity={userConditions?.dyslexia?.severity === 'severe' ? 'severe' : 'mild'}
                />
              ) : (
                <div
                  className="p-6 rounded-lg border min-h-[400px] transition-all duration-300"
                  style={getAdaptedStyles()}
                >
                  <p className="text-pretty">{displayText}</p>
                </div>
              )}
              
              {showSummary && (
                <Card className="mt-4 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      TL;DR Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-blue-50 p-3 rounded">{summary}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowSummary(false)}
                      className="mt-2"
                    >
                      Hide Summary
                    </Button>
                  </CardContent>
                </Card>
              )}

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
      
      {/* AI Behavior Agent */}
      <AIBehaviorAgent 
        userCondition={userDisorder as "dyslexia" | "adhd" | "vision" | null}
        onSuggestionApply={handleAISuggestion}
      />
    </div>
  )
}
