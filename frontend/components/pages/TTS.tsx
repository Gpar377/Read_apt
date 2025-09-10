"use client"

import { MainLayout } from "@/components/templates/MainLayout"
import { TTSPlayer } from "@/components/TTSPlayer"

export const TTS = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Text-to-Speech</h1>
            <p className="text-muted-foreground">
              Convert any text to natural-sounding speech with customizable voice settings.
            </p>
          </div>
          <TTSPlayer />
        </div>
      </div>
    </MainLayout>
  )
}
