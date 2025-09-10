"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, Square, Volume2, Download } from "lucide-react"
import { apiService } from "@/services/api"

export const TTSPlayer = () => {
  const [text, setText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [speed, setSpeed] = useState([1])
  const [voice, setVoice] = useState("default")
  const audioRef = useRef<HTMLAudioElement>(null)

  const sampleText =
    "This is a sample text to demonstrate the text-to-speech functionality. You can customize the voice, speed, and other settings to match your preferences."

  const handleGenerateAudio = async () => {
    const textToSpeak = text || sampleText
    if (!textToSpeak.trim()) return

    setIsGenerating(true)
    try {
      const ttsRequest = {
        text: textToSpeak,
        voice,
        speed: speed[0],
      }

      const result = await apiService.speakText(ttsRequest)

      if (result.audioUrl) {
        setAudioUrl(result.audioUrl)
      } else {
        // Fallback to Web Speech API
        generateWebSpeech(textToSpeak)
      }
    } catch (error) {
      console.error("TTS generation failed:", error)
      // Fallback to Web Speech API
      generateWebSpeech(textToSpeak)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateWebSpeech = (textToSpeak: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.rate = speed[0]
      utterance.voice = speechSynthesis.getVoices().find((v) => v.name.includes(voice)) || null

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      speechSynthesis.speak(utterance)
    }
  }

  const handlePlay = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      generateWebSpeech(text || sampleText)
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    } else {
      speechSynthesis.pause()
    }
    setIsPlaying(false)
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    } else {
      speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a")
      link.href = audioUrl
      link.download = "speech.mp3"
      link.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5" />
            <span>Text Input</span>
          </CardTitle>
          <CardDescription>Enter the text you want to convert to speech</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={sampleText}
            className="min-h-[150px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Settings</CardTitle>
          <CardDescription>Customize the voice and speech parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Selection */}
          <div className="space-y-2">
            <Label>Voice Type</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="child">Child</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <Label>Speech Speed: {speed[0]}x</Label>
            <Slider value={speed} onValueChange={setSpeed} min={0.5} max={2} step={0.1} className="w-full" />
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerateAudio} className="w-full" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Audio"}
          </Button>
        </CardContent>
      </Card>

      {/* Audio Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Audio Controls</CardTitle>
          <CardDescription>Play, pause, and control the generated speech</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="lg" onClick={handlePlay} disabled={isPlaying || (!audioUrl && !text)}>
              <Play className="h-5 w-5" />
            </Button>

            <Button variant="outline" size="lg" onClick={handlePause} disabled={!isPlaying}>
              <Pause className="h-5 w-5" />
            </Button>

            <Button variant="outline" size="lg" onClick={handleStop} disabled={!isPlaying}>
              <Square className="h-5 w-5" />
            </Button>

            {audioUrl && (
              <Button variant="outline" size="lg" onClick={handleDownload}>
                <Download className="h-5 w-5" />
              </Button>
            )}
          </div>

          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full mt-4"
              controls
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
