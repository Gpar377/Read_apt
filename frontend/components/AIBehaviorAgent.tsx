"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, X, CheckCircle, XCircle } from "lucide-react"

interface AIBehaviorAgentProps {
  userCondition?: "dyslexia" | "adhd" | "vision" | null
  onSuggestionApply: (suggestion: string) => void
}

interface Suggestion {
  id: string
  type: "pause" | "reread" | "disorder_specific"
  message: string
  action: string
  timestamp: number
}

export function AIBehaviorAgent({ userCondition, onSuggestionApply }: AIBehaviorAgentProps) {
  const [isActive, setIsActive] = useState(true)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [rejectedSuggestions, setRejectedSuggestions] = useState<Set<string>>(new Set())
  const [userActivity, setUserActivity] = useState({
    lastActivity: Date.now(),
    scrollUps: 0,
    idleTime: 0,
    totalReadingTime: 0
  })

  const activityRef = useRef(userActivity)
  const monitoringIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!isActive) return

    // Track mouse movement and keyboard activity
    const handleActivity = () => {
      const now = Date.now()
      setUserActivity(prev => ({
        ...prev,
        lastActivity: now,
        idleTime: 0,
        totalReadingTime: prev.totalReadingTime + (now - prev.lastActivity) / 1000
      }))
      activityRef.current.lastActivity = now
      activityRef.current.idleTime = 0
    }

    // Track scroll behavior
    const handleScroll = () => {
      const scrollDirection = window.scrollY < activityRef.current.lastActivity ? 'up' : 'down'
      if (scrollDirection === 'up') {
        setUserActivity(prev => ({
          ...prev,
          scrollUps: prev.scrollUps + 1
        }))
        activityRef.current.scrollUps += 1
      }
      handleActivity()
    }

    // Add event listeners
    document.addEventListener('mousemove', handleActivity)
    document.addEventListener('keydown', handleActivity)
    document.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleActivity)

    // Start monitoring interval
    monitoringIntervalRef.current = setInterval(() => {
      checkForSuggestions()
    }, 5000) // Check every 5 seconds

    return () => {
      document.removeEventListener('mousemove', handleActivity)
      document.removeEventListener('keydown', handleActivity)
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleActivity)
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current)
      }
    }
  }, [isActive])

  const checkForSuggestions = () => {
    const now = Date.now()
    const timeSinceLastActivity = now - activityRef.current.lastActivity
    const idleThreshold = 10000 // 10 seconds

    // Check for idle behavior
    if (timeSinceLastActivity > idleThreshold && !rejectedSuggestions.has('idle_help')) {
      const suggestion = generateIdleSuggestion()
      if (suggestion) {
        addSuggestion(suggestion)
      }
    }

    // Check for excessive scrolling up (re-reading)
    if (activityRef.current.scrollUps >= 4 && !rejectedSuggestions.has('reread_help')) {
      const suggestion = generateRereadSuggestion()
      if (suggestion) {
        addSuggestion(suggestion)
      }
    }

    // Disorder-specific suggestions
    if (userCondition && activityRef.current.totalReadingTime > 60) {
      const suggestion = generateDisorderSpecificSuggestion()
      if (suggestion && !rejectedSuggestions.has(suggestion.id)) {
        addSuggestion(suggestion)
      }
    }
  }

  const generateIdleSuggestion = (): Suggestion | null => {
    const suggestions = [
      {
        message: "You've been idle for a while. Want me to increase line spacing?",
        action: "increase_line_spacing"
      },
      {
        message: "Need a break? Should I turn on Text-to-Speech?",
        action: "enable_tts"
      },
      {
        message: "Having trouble focusing? Want me to increase font size?",
        action: "increase_font_size"
      }
    ]

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    
    return {
      id: 'idle_help',
      type: 'pause',
      message: randomSuggestion.message,
      action: randomSuggestion.action,
      timestamp: Date.now()
    }
  }

  const generateRereadSuggestion = (): Suggestion | null => {
    const suggestions = [
      {
        message: "I notice you're scrolling up frequently. Want me to summarize this text?",
        action: "summarize_text"
      },
      {
        message: "Having trouble with comprehension? Should I increase spacing?",
        action: "increase_spacing"
      },
      {
        message: "Want me to break this into smaller chunks?",
        action: "chunk_text"
      }
    ]

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    
    return {
      id: 'reread_help',
      type: 'reread',
      message: randomSuggestion.message,
      action: randomSuggestion.action,
      timestamp: Date.now()
    }
  }

  const generateDisorderSpecificSuggestion = (): Suggestion | null => {
    if (!userCondition) return null

    const suggestionMap = {
      adhd: [
        {
          id: 'adhd_tldr',
          message: "Long text detected. Want a TL;DR summary?",
          action: "generate_summary"
        },
        {
          id: 'adhd_highlight',
          message: "Having trouble focusing? Want me to highlight key words?",
          action: "highlight_keywords"
        }
      ],
      dyslexia: [
        {
          id: 'dyslexia_letters',
          message: "I can highlight confusing letters like b/d and p/q. Want me to enable this?",
          action: "highlight_confusing_letters"
        },
        {
          id: 'dyslexia_font',
          message: "Want me to switch to a dyslexia-friendly font?",
          action: "dyslexic_font"
        }
      ],
      vision: [
        {
          id: 'vision_contrast',
          message: "Need better visibility? Want me to increase contrast?",
          action: "high_contrast"
        },
        {
          id: 'vision_zoom',
          message: "Text too small? Should I increase the zoom level?",
          action: "increase_zoom"
        }
      ]
    }

    const conditionSuggestions = suggestionMap[userCondition]
    if (!conditionSuggestions) return null

    const randomSuggestion = conditionSuggestions[Math.floor(Math.random() * conditionSuggestions.length)]
    
    return {
      id: randomSuggestion.id,
      type: 'disorder_specific',
      message: randomSuggestion.message,
      action: randomSuggestion.action,
      timestamp: Date.now()
    }
  }

  const addSuggestion = (suggestion: Suggestion) => {
    setSuggestions(prev => {
      // Only keep the latest 3 suggestions
      const filtered = prev.filter(s => s.id !== suggestion.id)
      return [suggestion, ...filtered].slice(0, 3)
    })
  }

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    onSuggestionApply(suggestion.action)
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
  }

  const handleRejectSuggestion = (suggestion: Suggestion) => {
    setRejectedSuggestions(prev => new Set([...prev, suggestion.id]))
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
  }

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
  }

  if (!isActive || suggestions.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsActive(!isActive)}
          className="bg-white shadow-lg"
        >
          <Bot className="h-4 w-4 mr-2" />
          {isActive ? "AI Agent Active" : "Enable AI Agent"}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="shadow-lg border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-500" />
                <Badge variant="secondary" className="text-xs">
                  {suggestion.type === 'pause' ? 'Idle' : 
                   suggestion.type === 'reread' ? 'Re-read' : 
                   userCondition?.toUpperCase()}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissSuggestion(suggestion.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm mb-3">{suggestion.message}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleAcceptSuggestion(suggestion)}
                className="flex-1"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Yes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRejectSuggestion(suggestion)}
                className="flex-1"
              >
                <XCircle className="h-3 w-3 mr-1" />
                No
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsActive(false)}
          className="text-xs text-muted-foreground"
        >
          Disable AI Agent
        </Button>
      </div>
    </div>
  )
}