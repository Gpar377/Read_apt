"use client"

import { useState } from "react"
import { MainLayout } from "@/components/templates/MainLayout"
import { OCRUpload } from "@/components/OCRUpload"
import { AdaptedText } from "@/components/AdaptedText"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileImage, Zap, Shield } from "lucide-react"

export default function OCRPage() {
  const [extractedText, setExtractedText] = useState("")
  const [adaptationResult, setAdaptationResult] = useState<any>(null)

  const handleTextExtracted = (text: string, adaptedResult?: any) => {
    setExtractedText(text)
    setAdaptationResult(adaptedResult)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileImage className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">OCR Text Extraction</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload images or scanned documents to extract text and apply accessibility adaptations
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileImage className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Image to Text</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Extract text from images, PDFs, and scanned documents with high accuracy
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Single Disorder Focus</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Apply adaptations for one condition at a time for optimal results
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Privacy Protected</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Images are processed securely and not stored on our servers
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <OCRUpload onTextExtracted={handleTextExtracted} />
          </div>

          {/* Results Section */}
          <div>
            {extractedText && (
              <Card>
                <CardHeader>
                  <CardTitle>Adapted Text</CardTitle>
                  <CardDescription>
                    {adaptationResult?.primary_disorder 
                      ? `Adapted for ${adaptationResult.primary_disorder}` 
                      : "No adaptations applied"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdaptedText 
                    text={extractedText}
                    adaptationResult={adaptationResult}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}