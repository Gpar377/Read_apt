"use client"

import { useEffect, useState } from "react"

interface DyslexiaTextRendererProps {
  text: string
  severity: "mild" | "severe"
  className?: string
}

export function DyslexiaTextRenderer({ text, severity, className = "" }: DyslexiaTextRendererProps) {
  const [processedText, setProcessedText] = useState("")

  useEffect(() => {
    const processText = () => {
      if (severity === "severe") {
        // Apply comprehensive dyslexia adaptations
        let processed = text
        
        // 1. Highlight mirror letters
        const mirrorPairs = [['b', 'd'], ['p', 'q'], ['m', 'w'], ['n', 'u']]
        mirrorPairs.forEach(([letter1, letter2]) => {
          const regex1 = new RegExp(`(?<!<[^>]*)(${letter1})(?![^<]*>)`, 'gi')
          const regex2 = new RegExp(`(?<!<[^>]*)(${letter2})(?![^<]*>)`, 'gi')
          processed = processed.replace(regex1, `<span style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: 700; color: #92400e; border: 1px solid #f59e0b;">$1</span>`)
          processed = processed.replace(regex2, `<span style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: 700; color: #92400e; border: 1px solid #f59e0b;">$2</span>`)
        })
        
        // 2. Color-code vowels
        const vowels = ['a', 'e', 'i', 'o', 'u']
        vowels.forEach(vowel => {
          const regex = new RegExp(`(?<!<[^>]*)(${vowel})(?![^<]*>)`, 'gi')
          processed = processed.replace(regex, `<span style="background-color: #dbeafe; padding: 1px 2px; border-radius: 2px; color: #1e40af;">$1</span>`)
        })
        
        // 3. Break long words with syllable markers
        const words = processed.split(' ')
        const processedWords = words.map(word => {
          const cleanWord = word.replace(/<[^>]*>/g, '')
          if (cleanWord.length > 6) {
            return breakIntoSyllables(word)
          }
          return word
        })
        
        setProcessedText(processedWords.join(' '))
      } else {
        // Mild dyslexia - just highlight mirror letters
        let processed = text
        const mirrorPairs = [['b', 'd'], ['p', 'q'], ['m', 'w'], ['n', 'u']]
        mirrorPairs.forEach(([letter1, letter2]) => {
          const regex1 = new RegExp(`(?<!<[^>]*)(${letter1})(?![^<]*>)`, 'gi')
          const regex2 = new RegExp(`(?<!<[^>]*)(${letter2})(?![^<]*>)`, 'gi')
          processed = processed.replace(regex1, `<span style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: 700; color: #92400e; border: 1px solid #f59e0b;">$1</span>`)
          processed = processed.replace(regex2, `<span style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: 700; color: #92400e; border: 1px solid #f59e0b;">$2</span>`)
        })
        setProcessedText(processed)
      }
    }

    processText()
  }, [text, severity])

  const breakIntoSyllables = (word: string): string => {
    const cleanWord = word.replace(/<[^>]*>/g, '')
    if (cleanWord.length <= 3) return word
    
    const syllables = []
    let current = ""
    
    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i]
      current += char
      
      if ('aeiouAEIOU'.includes(char) && i < cleanWord.length - 1) {
        if (current.length >= 2) {
          syllables.push(current)
          current = ""
        }
      }
    }
    
    if (current) {
      if (syllables.length > 0) {
        syllables[syllables.length - 1] += current
      } else {
        syllables.push(current)
      }
    }
    
    return syllables.length > 1 ? syllables.join('·') : word
  }

  const containerClass = severity === "severe" ? "dyslexia-severe" : "dyslexia-friendly"

  return (
    <div 
      className={`${containerClass} ${className}`}
      dangerouslySetInnerHTML={{ __html: processedText }}
      style={{
        fontFamily: '"OpenDyslexic", "Comic Sans MS", Arial, sans-serif',
        lineHeight: severity === "severe" ? "2.8" : "2.2",
        letterSpacing: severity === "severe" ? "0.2em" : "0.15em",
        wordSpacing: severity === "severe" ? "0.3em" : "0.2em",
        backgroundColor: severity === "severe" ? "#fefce8" : "#fffbeb",
        color: "#1f2937",
        padding: severity === "severe" ? "25px" : "20px",
        borderRadius: "8px",
        maxWidth: severity === "severe" ? "60ch" : "70ch",
        margin: "0 auto"
      }}
    />
  )
}