"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ADHDTextRendererProps {
  text: string
  preset: "normal" | "inattentive" | "hyperactive" | "combined"
  className?: string
  onSummarize?: () => void
}

export function ADHDTextRenderer({ text, preset, className = "", onSummarize }: ADHDTextRendererProps) {
  const [processedText, setProcessedText] = useState("")
  const [currentChunk, setCurrentChunk] = useState(0)
  const [showTLDR, setShowTLDR] = useState(false)
  const [chunks, setChunks] = useState<string[]>([])

  useEffect(() => {
    const processText = () => {
      if (preset === "normal") {
        setProcessedText(text)
        return
      }

      let processed = text
      const sentences = text.split(/[.!?]+/).filter(s => s.trim())

      if (preset === "inattentive" || preset === "combined") {
        // Highlight every 3rd word
        const words = processed.split(' ')
        processed = words.map((word, index) => {
          if ((index + 1) % 3 === 0) {
            return `<span style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: 600; color: #92400e; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">${word}</span>`
          }
          return word
        }).join(' ')
      }

      if (preset === "hyperactive" || preset === "combined") {
        // Create sentence chunks (3-4 sentences per chunk)
        const sentenceChunks = []
        for (let i = 0; i < sentences.length; i += 3) {
          sentenceChunks.push(sentences.slice(i, i + 3).join('. ') + '.')
        }
        setChunks(sentenceChunks)
        
        if (sentenceChunks.length > 0) {
          processed = sentenceChunks[0]
        }
      }

      setProcessedText(processed)
    }

    processText()
  }, [text, preset])

  const nextChunk = () => {
    if (currentChunk < chunks.length - 1) {
      setCurrentChunk(currentChunk + 1)
      let nextText = chunks[currentChunk + 1]
      
      if (preset === "combined") {
        // Apply highlighting to the chunk
        const words = nextText.split(' ')
        nextText = words.map((word, index) => {
          if ((index + 1) % 3 === 0) {
            return `<span style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: 600; color: #92400e; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">${word}</span>`
          }
          return word
        }).join(' ')
      }
      
      setProcessedText(nextText)
    }
  }

  const prevChunk = () => {
    if (currentChunk > 0) {
      setCurrentChunk(currentChunk - 1)
      let prevText = chunks[currentChunk - 1]
      
      if (preset === "combined") {
        // Apply highlighting to the chunk
        const words = prevText.split(' ')
        prevText = words.map((word, index) => {
          if ((index + 1) % 3 === 0) {
            return `<span style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: 600; color: #92400e; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">${word}</span>`
          }
          return word
        }).join(' ')
      }
      
      setProcessedText(prevText)
    }
  }

  const getContainerStyles = () => {
    const baseStyles: React.CSSProperties = {
      fontSize: "18px",
      lineHeight: preset === "hyperactive" || preset === "combined" ? "2.2" : "1.8",
      letterSpacing: "0.05em",
      fontFamily: "system-ui, sans-serif",
      backgroundColor: "#f0f4ff",
      color: "#1e293b",
      padding: "25px",
      borderRadius: "8px",
      maxWidth: "70ch",
      margin: "0 auto"
    }

    return baseStyles
  }

  return (
    <div className={`adhd-text-container ${className}`}>
      <div 
        className="adhd-text-content"
        style={getContainerStyles()}
        dangerouslySetInnerHTML={{ __html: processedText }}
      />
      
      {(preset === "hyperactive" || preset === "combined") && chunks.length > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button 
            onClick={prevChunk} 
            disabled={currentChunk === 0}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Chunk {currentChunk + 1} of {chunks.length}
          </span>
          <Button 
            onClick={nextChunk} 
            disabled={currentChunk === chunks.length - 1}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {(preset === "hyperactive" || preset === "combined") && (
        <div className="mt-4 flex gap-2">
          <Button 
            onClick={() => setShowTLDR(!showTLDR)}
            variant="secondary"
          >
            {showTLDR ? "Hide" : "Show"} TL;DR
          </Button>
          {onSummarize && (
            <Button onClick={onSummarize} variant="outline">
              Generate Summary
            </Button>
          )}
        </div>
      )}

      {showTLDR && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">TL;DR Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {text.length > 200 ? text.substring(0, 200) + "..." : text}
            </p>
          </CardContent>
        </Card>
      )}


    </div>
  )
}