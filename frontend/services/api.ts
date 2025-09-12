// API service layer for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface AssessmentData {
  answers: number[]
  demographics?: any
}

interface AdaptationRequest {
  text: string
  preferences?: any
}

interface TTSRequest {
  text: string
  voice?: string
  speed?: number
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Assessment endpoints
  async predictDyslexia(data: any) {
    return this.request("/dyslexia/predict-enhanced", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async predictADHD(data: AssessmentData) {
    return this.request("/adhd/predict", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async classifyVision(data: AssessmentData) {
    return this.request("/adaptation/vision/classify", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Text adaptation endpoints
  async adaptText(request: AdaptationRequest) {
    return this.request("/adaptation/adapt-text", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getAdaptationPresets() {
    return this.request("/adaptation/presets")
  }

  // TTS endpoints
  async speakText(request: TTSRequest) {
    return this.request("/tts/speak", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  // AI Agents endpoint
  async intelligentRouting(query: string) {
    return this.request("/agents/intelligent-routing", {
      method: "POST",
      body: JSON.stringify({ query }),
    })
  }

  // OCR endpoints
  async extractTextFromImage(imageBase64: string, disorderType?: string, severity?: string) {
    return this.request("/ocr/extract-and-adapt", {
      method: "POST",
      body: JSON.stringify({
        image_base64: imageBase64,
        disorder_type: disorderType,
        severity: severity
      }),
    })
  }

  async getSupportedFormats() {
    return this.request("/ocr/supported-formats")
  }

  // Summary endpoints
  async generateSummary(text: string, summaryType: string = "general", maxLength: number = 100) {
    return this.request("/summary/generate", {
      method: "POST",
      body: JSON.stringify({
        text: text,
        summary_type: summaryType,
        max_length: maxLength
      }),
    })
  }

  async generateTLDR(text: string) {
    return this.request("/summary/tldr", {
      method: "POST",
      body: JSON.stringify({ text }),
    })
  }

  // Enhanced assessment endpoints
  async predictDyslexiaEnhanced(data: { reading_speed: number; survey_score: number; comprehension_score?: number }) {
    return this.request("/dyslexia/predict-enhanced", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService()
