import type { ReactNode } from "react"
import { useUserPreferences } from "@/components/context/UserPreferencesContext"

interface ReaderLayoutProps {
  children: ReactNode
}

export const ReaderLayout = ({ children }: ReaderLayoutProps) => {
  const { preferences } = useUserPreferences()

  return (
    <div
      className={`min-h-screen p-8 ${
        preferences.theme === "high-contrast" ? "bg-black text-white" : "bg-cream text-gray-900"
      }`}
      style={{
        fontSize: preferences.fontSize,
        fontFamily: preferences.fontFamily,
        lineHeight: preferences.lineSpacing,
        letterSpacing: preferences.letterSpacing,
      }}
    >
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  )
}
