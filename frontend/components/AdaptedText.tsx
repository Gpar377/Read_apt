"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { FileText, Settings, Eye } from "lucide-react"
import { apiService } from "@/services/api"
import { useUserPreferences } from "@/components/context/UserPreferencesContext"

export const AdaptedText = () => {
  const [inputText, setInputText] = useState("")
  const [adaptedText, setAdaptedText] = useState("")
  const [isAdapting, setIsAdapting] = useState(false)
  const { preferences, updatePreference } = useUserPreferences()

  // Local adaptation settings
  const [fontSize, setFontSize] = useState([16])
  const [lineSpacing, setLineSpacing] = useState([1.5])
  const [letterSpacing, setLetterSpacing] = useState([0.1])
  const [fontFamily, setFontFamily] = useState("OpenDyslexic")
  const [highlightMode, setHighlightMode] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const sampleText = `Reading can be challenging for many people, especially those with dyslexia, ADHD, or vision difficulties. This text adaptation tool helps make reading more accessible by adjusting fonts, spacing, and formatting to improve readability and comprehension.`

  useEffect(() => {
    if (!inputText) {
      setInputText(sampleText)
    }
  }, [])

  const handleAdaptText = async () => {
    if (!inputText.trim()) return

    setIsAdapting(true)
    try {
      const adaptationRequest = {
        text: inputText,
        preferences: {
          fontSize: fontSize[0],
          lineSpacing: lineSpacing[0],
          letterSpacing: letterSpacing[0],
          fontFamily,
          highlightMode,
          darkMode,
        },
      }

      const result = await apiService.adaptText(adaptationRequest)
      setAdaptedText(result.adaptedText || inputText)
    } catch (error) {
      console.error("Text adaptation failed:", error)
      // Fallback to local adaptation
      setAdaptedText(inputText)
    } finally {
      setIsAdapting(false)
    }
  }

  const adaptedTextStyle = {
    fontSize: `${fontSize[0]}px`,
    lineHeight: lineSpacing[0],
    letterSpacing: `${letterSpacing[0]}em`,
    fontFamily: fontFamily === "OpenDyslexic" ? "OpenDyslexic, sans-serif" : fontFamily,
    backgroundColor: darkMode ? "#1a1a1a" : highlightMode ? "#fffbf0" : "#ffffff",
    color: darkMode ? "#ffffff" : "#000000",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Input Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Input Text</span>
            </CardTitle>
            <CardDescription>Paste or type the text you want to adapt for better readability</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="min-h-[200px] resize-none"
            />
            <Button onClick={handleAdaptText} className="mt-4 w-full" disabled={isAdapting || !inputText.trim()}>
              {isAdapting ? "Adapting..." : "Adapt Text"}
            </Button>
          </CardContent>
        </Card>

        {/* Adapted Text Preview */}
        {(adaptedText || inputText) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Adapted Text Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={adaptedTextStyle}>{adaptedText || inputText}</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Settings Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Adaptation Settings</span>
          </CardTitle>
          <CardDescription>Customize the text formatting to your preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Font Size */}
          <div className="space-y-2">
            <Label>Font Size: {fontSize[0]}px</Label>
            <Slider value={fontSize} onValueChange={setFontSize} min={12} max={32} step={1} className="w-full" />
          </div>

          {/* Line Spacing */}
          <div className="space-y-2">
            <Label>Line Spacing: {lineSpacing[0]}</Label>
            <Slider value={lineSpacing} onValueChange={setLineSpacing} min={1} max={3} step={0.1} className="w-full" />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-2">
            <Label>Letter Spacing: {letterSpacing[0]}em</Label>
            <Slider
              value={letterSpacing}
              onValueChange={setLetterSpacing}
              min={0}
              max={0.5}
              step={0.05}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Font Family */}
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OpenDyslexic">OpenDyslexic</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="highlight-mode">Highlight Mode</Label>
              <Switch id="highlight-mode" checked={highlightMode} onCheckedChange={setHighlightMode} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>

          <Separator />

          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              updatePreference("fontSize", `${fontSize[0]}px`)
              updatePreference("lineSpacing", lineSpacing[0].toString())
              updatePreference("letterSpacing", `${letterSpacing[0]}em`)
              updatePreference("fontFamily", fontFamily)
            }}
          >
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
