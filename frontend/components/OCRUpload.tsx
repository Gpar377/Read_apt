"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileImage, Loader2, Eye, Download } from "lucide-react"
import { apiService } from "@/services/api"

interface OCRUploadProps {
  onTextExtracted: (text: string, adaptedResult?: any) => void
}

export function OCRUpload({ onTextExtracted }: OCRUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const [selectedDisorder, setSelectedDisorder] = useState<string>("normal")
  const [severity, setSeverity] = useState<string>("normal")
  const [ocrResult, setOcrResult] = useState<any>(null)
  const [previewImage, setPreviewImage] = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    setIsProcessing(true)
    setPreviewImage(URL.createObjectURL(file))

    try {
      const base64 = await fileToBase64(file)
      
      const result = await apiService.extractTextFromImage(
        base64,
        selectedDisorder === "normal" ? undefined : selectedDisorder,
        severity === "normal" ? undefined : severity
      )
      
      if (result.success) {
        setExtractedText(result.ocr_result.extracted_text)
        setOcrResult(result)
        onTextExtracted(result.ocr_result.extracted_text, result.adaptation_result)
      } else {
        console.error("OCR failed:", result.error)
      }
    } catch (error) {
      console.error("OCR processing error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  return (
    <div className="space-y-6">
      {/* Disorder Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Settings</CardTitle>
          <CardDescription>Choose your primary reading difficulty (one at a time)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Primary Disorder</label>
              <Select value={selectedDisorder} onValueChange={setSelectedDisorder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select disorder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">No Adaptation</SelectItem>
                  <SelectItem value="dyslexia">Dyslexia</SelectItem>
                  <SelectItem value="adhd">ADHD</SelectItem>
                  <SelectItem value="vision">Vision Impairment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedDisorder !== "normal" && (
              <div>
                <label className="text-sm font-medium">Severity</label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image for OCR</CardTitle>
          <CardDescription>Upload an image containing text to extract and adapt</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-primary"
          >
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {isProcessing ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Processing image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p>Drag & drop an image here, or click to select</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, BMP, TIFF (max 10MB)</p>
              </div>
            )}
          </div>

          {previewImage && (
            <div className="mt-4">
              <img src={previewImage} alt="Preview" className="max-h-48 mx-auto rounded" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {ocrResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Extracted Text
            </CardTitle>
            <CardDescription>
              Confidence: {Math.round(ocrResult.ocr_result.confidence * 100)}% | 
              Words: {ocrResult.ocr_result.word_count} | 
              Applied: {ocrResult.disorder_applied || "None"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="min-h-32"
              placeholder="Extracted text will appear here..."
            />
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => onTextExtracted(extractedText, ocrResult.adaptation_result)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Use This Text
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}