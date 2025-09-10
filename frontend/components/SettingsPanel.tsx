"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Settings, Save, RotateCcw } from "lucide-react"
import { useUserPreferences } from "@/components/context/UserPreferencesContext"

export const SettingsPanel = () => {
  const { preferences, updatePreference, setPreferences } = useUserPreferences()

  const handleReset = () => {
    setPreferences({
      fontSize: "16px",
      theme: "light",
      fontFamily: "OpenDyslexic",
      lineSpacing: "1.5",
      letterSpacing: "0.1em",
      dyslexiaMode: false,
      adhdMode: false,
      visionMode: false,
    })
  }

  const handleSave = () => {
    // In a real app, this would save to backend
    localStorage.setItem("userPreferences", JSON.stringify(preferences))
    // Show success message
  }

  return (
    <div className="space-y-6">
      {/* Reading Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Reading Preferences</span>
          </CardTitle>
          <CardDescription>Customize your reading experience based on your needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Font Size */}
          <div className="space-y-2">
            <Label>Font Size: {preferences.fontSize}</Label>
            <Slider
              value={[Number.parseInt(preferences.fontSize)]}
              onValueChange={(value) => updatePreference("fontSize", `${value[0]}px`)}
              min={12}
              max={32}
              step={1}
              className="w-full"
            />
          </div>

          {/* Line Spacing */}
          <div className="space-y-2">
            <Label>Line Spacing: {preferences.lineSpacing}</Label>
            <Slider
              value={[Number.parseFloat(preferences.lineSpacing)]}
              onValueChange={(value) => updatePreference("lineSpacing", value[0].toString())}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-2">
            <Label>Letter Spacing: {preferences.letterSpacing}</Label>
            <Slider
              value={[Number.parseFloat(preferences.letterSpacing)]}
              onValueChange={(value) => updatePreference("letterSpacing", `${value[0]}em`)}
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
            <Select value={preferences.fontFamily} onValueChange={(value) => updatePreference("fontFamily", value)}>
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

          {/* Theme */}
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={preferences.theme} onValueChange={(value) => updatePreference("theme", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="high-contrast">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Modes */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Modes</CardTitle>
          <CardDescription>Enable specific modes based on your assessment results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dyslexia-mode">Dyslexia Support</Label>
              <p className="text-sm text-muted-foreground">Enhanced spacing and highlighting</p>
            </div>
            <Switch
              id="dyslexia-mode"
              checked={preferences.dyslexiaMode}
              onCheckedChange={(checked) => updatePreference("dyslexiaMode", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="adhd-mode">ADHD Support</Label>
              <p className="text-sm text-muted-foreground">Focus aids and chunking</p>
            </div>
            <Switch
              id="adhd-mode"
              checked={preferences.adhdMode}
              onCheckedChange={(checked) => updatePreference("adhdMode", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="vision-mode">Vision Support</Label>
              <p className="text-sm text-muted-foreground">Large text and high contrast</p>
            </div>
            <Switch
              id="vision-mode"
              checked={preferences.visionMode}
              onCheckedChange={(checked) => updatePreference("visionMode", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button onClick={handleSave} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  )
}
