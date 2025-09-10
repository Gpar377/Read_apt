"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface UserPreferences {
  fontSize: string
  theme: "light" | "dark" | "high-contrast"
  fontFamily: string
  lineSpacing: string
  letterSpacing: string
  dyslexiaMode: boolean
  adhdMode: boolean
  visionMode: boolean
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  setPreferences: (preferences: UserPreferences) => void
  updatePreference: (key: keyof UserPreferences, value: any) => void
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: "16px",
    theme: "light",
    fontFamily: "OpenDyslexic",
    lineSpacing: "1.5",
    letterSpacing: "0.1em",
    dyslexiaMode: false,
    adhdMode: false,
    visionMode: false,
  })

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <UserPreferencesContext.Provider value={{ preferences, setPreferences, updatePreference }}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider")
  }
  return context
}
