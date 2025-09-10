"use client"

import { MainLayout } from "@/components/templates/MainLayout"
import { SettingsPanel } from "@/components/SettingsPanel"

export const Preferences = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Preferences</h1>
            <p className="text-muted-foreground">Customize your reading experience with personalized settings.</p>
          </div>
          <SettingsPanel />
        </div>
      </div>
    </MainLayout>
  )
}
