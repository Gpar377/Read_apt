"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Home, Play, Pause, Volume2, Type, Palette, Scaling as Spacing } from "lucide-react"

interface TextAdaptationProps {
  assessmentData: any
  onBack: () => void
  onHome: () => void
}

export function TextAdaptation({ assessmentData, onBack, onHome }: TextAdaptationProps) {
  const [inputText, setInputText] = useState(
    "Welcome to ReadApt! This is a sample text to demonstrate our accessibility features. You can paste your own text here to see how different adaptations can improve your reading experience. Our platform supports various customizations including font changes, spacing adjustments, color modifications, and text-to-speech functionality.",
  )

  // Adaptation settings
  const [fontSize, setFontSize] = useState([16])
  const [lineSpacing, setLineSpacing] = useState([1.5])
  const [letterSpacing, setLetterSpacing] = useState([0])
  const [wordSpacing, setWordSpacing] = useState([0])
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [readingGuide, setReadingGuide] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("white")
  const [textColor, setTextColor] = useState("black")

  // TTS settings
  const [isPlaying, setIsPlaying] = useState(false)
  const [speechRate, setSpeechRate] = useState([1])
  const [speechVolume, setSpeechVolume] = useState([0.8])

  // Apply assessment-based presets
  const applyDyslexiaPreset = () => {
    setDyslexiaFont(true)
    setLetterSpacing([0.12])
    setWordSpacing([0.16])
    setLineSpacing([1.8])
    setFontSize([18])
    setBackgroundColor("cream")
  }

  const applyADHDPreset = () => {
    setLineSpacing([2])
    setFontSize([16])
    setReadingGuide(true)
    setBackgroundColor("lightblue")
  }

  const applyVisionPreset = () => {
    setFontSize([24])
    setHighContrast(true)
    setTextColor("black")
    setBackgroundColor("yellow")
  }

  // TTS functionality
  const toggleSpeech = () => {
    if (isPlaying) {
      speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(inputText)
      utterance.rate = speechRate[0]
      utterance.volume = speechVolume[0]
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
      setIsPlaying(true)
    }
  }

  // Generate adapted text styles
  const getAdaptedStyles = () => {
    return {
      fontSize: `${fontSize[0]}px`,
      lineHeight: lineSpacing[0],
      letterSpacing: `${letterSpacing[0]}em`,
      wordSpacing: `${wordSpacing[0]}em`,
      fontFamily: dyslexiaFont ? '"OpenDyslexic", "Comic Sans MS", sans-serif' : "inherit",
      backgroundColor:
        backgroundColor === "white"
          ? "#ffffff"
          : backgroundColor === "cream"
            ? "#fefce8"
            : backgroundColor === "lightblue"
              ? "#dbeafe"
              : backgroundColor === "yellow"
                ? "#fef3c7"
                : "#ffffff",
      color: textColor === "black" ? "#000000" : textColor === "darkblue" ? "#1e40af" : "#000000",
      filter: highContrast ? "contrast(150%)" : "none",
      padding: "1rem",
      borderRadius: "0.5rem",
      border: "1px solid #e5e7eb",
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-2 text-muted-foreground hover:text-foreground"
            aria-label="Go back to assessment results"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Text Adaptation Tool</h1>
          <p className="text-muted-foreground">Customize text display based on your assessment results</p>
        </div>
        <Button
          variant="outline"
          onClick={onHome}
          className="border-border bg-transparent"
          aria-label="Return to home page"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Quick Presets */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Quick Presets
              </CardTitle>
              <CardDescription>Apply settings based on your assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={applyDyslexiaPreset}
                variant="outline"
                className="w-full justify-start border-border bg-transparent"
              >
                Dyslexia-Friendly Settings
              </Button>
              <Button
                onClick={applyADHDPreset}
                variant="outline"
                className="w-full justify-start border-border bg-transparent"
              >
                ADHD Focus Settings
              </Button>
              <Button
                onClick={applyVisionPreset}
                variant="outline"
                className="w-full justify-start border-border bg-transparent"
              >
                Vision Enhancement Settings
              </Button>
            </CardContent>
          </Card>

          {/* Font Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                <Type className="w-5 h-5" />
                Font Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-card-foreground">Font Size: {fontSize[0]}px</Label>
                <Slider value={fontSize} onValueChange={setFontSize} max={32} min={12} step={1} className="mt-2" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dyslexia-font" className="text-sm font-medium text-card-foreground">
                  Dyslexia-Friendly Font
                </Label>
                <Switch id="dyslexia-font" checked={dyslexiaFont} onCheckedChange={setDyslexiaFont} />
              </div>
            </CardContent>
          </Card>

          {/* Spacing Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                <Spacing className="w-5 h-5" />
                Spacing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-card-foreground">Line Spacing: {lineSpacing[0]}</Label>
                <Slider
                  value={lineSpacing}
                  onValueChange={setLineSpacing}
                  max={3}
                  min={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-card-foreground">Letter Spacing: {letterSpacing[0]}em</Label>
                <Slider
                  value={letterSpacing}
                  onValueChange={setLetterSpacing}
                  max={0.2}
                  min={0}
                  step={0.01}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-card-foreground">Word Spacing: {wordSpacing[0]}em</Label>
                <Slider
                  value={wordSpacing}
                  onValueChange={setWordSpacing}
                  max={0.3}
                  min={0}
                  step={0.01}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Color Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">Color & Contrast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-card-foreground">Background Color</Label>
                <Select value={backgroundColor} onValueChange={setBackgroundColor}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="cream">Cream</SelectItem>
                    <SelectItem value="lightblue">Light Blue</SelectItem>
                    <SelectItem value="yellow">Light Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-card-foreground">Text Color</Label>
                <Select value={textColor} onValueChange={setTextColor}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="darkblue">Dark Blue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-sm font-medium text-card-foreground">
                  High Contrast
                </Label>
                <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reading-guide" className="text-sm font-medium text-card-foreground">
                  Reading Guide
                </Label>
                <Switch id="reading-guide" checked={readingGuide} onCheckedChange={setReadingGuide} />
              </div>
            </CardContent>
          </Card>

          {/* Text-to-Speech */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Text-to-Speech
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={toggleSpeech} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Reading
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Reading
                  </>
                )}
              </Button>

              <div>
                <Label className="text-sm font-medium text-card-foreground">Speech Rate: {speechRate[0]}</Label>
                <Slider
                  value={speechRate}
                  onValueChange={setSpeechRate}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-card-foreground">
                  Volume: {Math.round(speechVolume[0] * 100)}%
                </Label>
                <Slider
                  value={speechVolume}
                  onValueChange={setSpeechVolume}
                  max={1}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Text Display Panel */}
        <div className="space-y-6">
          {/* Input Text */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">Input Text</CardTitle>
              <CardDescription>Paste or type your text here</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                className="min-h-[120px] bg-input border-border"
              />
            </CardContent>
          </Card>

          {/* Adapted Text Preview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">Adapted Text Preview</CardTitle>
              <CardDescription>See how your text looks with current settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={getAdaptedStyles()} className={`min-h-[200px] ${readingGuide ? "reading-guide" : ""}`}>
                {inputText}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
