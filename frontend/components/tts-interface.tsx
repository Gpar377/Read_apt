"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Pause, Square, Volume2, Settings, RotateCcw } from "lucide-react"

export function TTSInterface() {
  const [text, setText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState([1])
  const [volume, setVolume] = useState([0.8])
  const [selectedVoice, setSelectedVoice] = useState("standard")
  const audioRef = useRef<HTMLAudioElement>(null)

  const voiceOptions = [
    {
      id: "standard",
      name: "Standard Voice",
      description: "Clear, neutral pronunciation",
      optimizedFor: "General use",
    },
    {
      id: "dyslexia",
      name: "Dyslexia Optimized",
      description: "Slower pace, clear enunciation",
      optimizedFor: "Dyslexia support",
    },
    {
      id: "adhd",
      name: "ADHD Friendly",
      description: "Engaging tone, natural pauses",
      optimizedFor: "ADHD support",
    },
  ]

  const handlePlay = async () => {
    if (!text.trim()) return

    setIsPlaying(true)
    setIsPaused(false)

    // Simulate TTS API call
    console.log("[v0] Starting TTS with settings:", {
      text: text.substring(0, 50) + "...",
      voice: selectedVoice,
      speed: speed[0],
      volume: volume[0],
    })

    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false)
    }, 3000)
  }

  const handlePause = () => {
    setIsPlaying(false)
    setIsPaused(true)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setIsPaused(false)
  }

  const handleReset = () => {
    setText("")
    setIsPlaying(false)
    setIsPaused(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Text-to-Speech</h2>
        <p className="text-muted-foreground">Convert text to speech with accessibility optimizations</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Text Input
            </CardTitle>
            <CardDescription>Enter the text you want to hear</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter or paste text to convert to speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] resize-none"
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Characters: {text.length}</span>
              <span>Estimated duration: {Math.ceil(text.length / 200)} minutes</span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handlePlay} disabled={!text.trim() || isPlaying} size="lg">
                <Play className="w-4 h-4 mr-2" />
                {isPlaying ? "Playing..." : isPaused ? "Resume" : "Play"}
              </Button>

              <Button variant="outline" onClick={handlePause} disabled={!isPlaying}>
                <Pause className="w-4 h-4" />
              </Button>

              <Button variant="outline" onClick={handleStop} disabled={!isPlaying && !isPaused}>
                <Square className="w-4 h-4" />
              </Button>

              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TTS Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Voice Settings
            </CardTitle>
            <CardDescription>Customize your listening experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Voice Selection */}
            <div className="space-y-3">
              <h4 className="font-medium">Voice Type</h4>
              {voiceOptions.map((voice) => (
                <div
                  key={voice.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedVoice === voice.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedVoice(voice.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{voice.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {voice.optimizedFor}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{voice.description}</p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Speed Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Speed</h4>
                <span className="text-sm text-muted-foreground">{speed[0]}x</span>
              </div>
              <Slider value={speed} onValueChange={setSpeed} max={2} min={0.5} step={0.1} className="w-full" />
            </div>

            {/* Volume Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Volume</h4>
                <span className="text-sm text-muted-foreground">{Math.round(volume[0] * 100)}%</span>
              </div>
              <Slider value={volume} onValueChange={setVolume} max={1} min={0} step={0.1} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audio Progress (when playing) */}
      {isPlaying && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Now Playing</span>
                  <span className="text-sm text-muted-foreground">0:15 / 2:30</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-1/4 transition-all"></div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {selectedVoice.charAt(0).toUpperCase() + selectedVoice.slice(1)} Voice
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
