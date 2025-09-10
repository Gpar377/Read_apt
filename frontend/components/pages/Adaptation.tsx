"use client"

import { MainLayout } from "@/components/templates/MainLayout"
import { AdaptedText } from "@/components/AdaptedText"

export const Adaptation = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Text Adaptation</h1>
            <p className="text-muted-foreground">
              Paste your text below and customize the formatting to improve readability.
            </p>
          </div>
          <AdaptedText />
        </div>
      </div>
    </MainLayout>
  )
}
