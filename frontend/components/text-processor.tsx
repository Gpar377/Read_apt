"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, FileText, Wand2, Save, Download } from "lucide-react"

export function TextProcessor() {
  const [inputText, setInputText] = useState("")
  const [adaptedText, setAdaptedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const adaptationPresets = [
    {
      id: "dyslexia",
      name: "Dyslexia Friendly",
      description: "Heavy spacing, highlighting, slower reading pace",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: "adhd",
      name: "ADHD Support",
      description: "Sentence chunking, TL;DR summaries, focus aids",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      id: "vision",
      name: "Vision Support",
      description: "Large text (150%), high contrast, clear fonts",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
  ]

  const handleTextUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInputText(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const adaptText = async () => {
    if (!inputText || !selectedPreset) return

    setIsProcessing(true)

    // Simulate API call to backend adaptation endpoint
    setTimeout(() => {
      let adapted = inputText

      if (selectedPreset === "dyslexia") {
        adapted = inputText.replace(/\s+/g, "   ").replace(/\./g, ".\n\n")
      } else if (selectedPreset === "adhd") {
        const sentences = inputText.split(". ")
        adapted = sentences.map((s) => `• ${s.trim()}`).join("\n\n")
      } else if (selectedPreset === "vision") {
        adapted = inputText.toUpperCase()
      }

      setAdaptedText(adapted)
      setIsProcessing(false)
    }, 2000)
  }

  const savePreferences = () => {
    // Save user preferences to backend
    console.log("[v0] Saving adaptation preferences:", selectedPreset)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Text Adaptation</h2>
        <p className="text-muted-foreground">Upload or paste text to adapt it for your reading needs</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Input Text
            </CardTitle>
            <CardDescription>Upload a file or paste your text below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="relative bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleTextUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
              <span className="text-sm text-muted-foreground">or paste text below</span>
            </div>

            <Textarea
              placeholder="Paste your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] resize-none"
            />

            <div className="text-sm text-muted-foreground">Characters: {inputText.length}</div>
          </CardContent>
        </Card>

        {/* Adaptation Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Adaptation Settings
            </CardTitle>
            <CardDescription>Choose your reading adaptation preset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {adaptationPresets.map((preset) => (
                <div
                  key={preset.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPreset === preset.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPreset(preset.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{preset.name}</h4>
                    <Badge className={preset.color}>{preset.id.toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{preset.description}</p>
                </div>
              ))}
            </div>

            <Separator />

            <Button onClick={adaptText} disabled={!inputText || !selectedPreset || isProcessing} className="w-full">
              {isProcessing ? "Adapting Text..." : "Adapt Text"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Adapted Text Display */}
      {adaptedText && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Adapted Text</CardTitle>
                <CardDescription>Your text optimized for {selectedPreset} reading</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={savePreferences}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`p-4 rounded-lg border bg-muted/50 ${
                selectedPreset === "dyslexia"
                  ? "font-mono leading-loose"
                  : selectedPreset === "adhd"
                    ? "space-y-2"
                    : selectedPreset === "vision"
                      ? "text-lg font-bold"
                      : ""
              }`}
            >
              <pre className="whitespace-pre-wrap font-inherit">{adaptedText}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
