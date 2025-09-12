import { MainLayout } from "@/components/templates/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, FileText, Volume2, FileImage, Zap, Shield, Users } from "lucide-react"
import Link from "next/link"

export const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "Smart Assessment",
      description: "5-question evaluation to identify reading challenges and personalize your experience",
      href: "/assessment",
    },
    {
      icon: FileText,
      title: "Text Adaptation",
      description: "AI-powered formatting with customizable spacing, fonts, and highlighting",
      href: "/adaptation",
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Natural voice synthesis optimized for different learning needs",
      href: "/tts",
    },
    {
      icon: FileImage,
      title: "OCR Text Extraction",
      description: "Upload images to extract and adapt text with accessibility features",
      href: "/ocr",
    },
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get personalized reading adaptations in seconds",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays secure and private",
    },
    {
      icon: Users,
      title: "Accessibility Focused",
      description: "Built specifically for users with reading difficulties",
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Accessible Reading for <span className="text-primary">Everyone</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            ReadApt uses AI to adapt text for users with dyslexia, ADHD, and vision difficulties. 
            Select your condition and get personalized reading support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/assessment">Select Your Condition & Start Assessment</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/text-adaptation">Try Text Adaptation</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{feature.description}</CardDescription>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={feature.href}>Try Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ReadApt?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <benefit.icon className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Improve Your Reading Experience?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of users who have improved their reading with ReadApt
          </p>
          <Button size="lg" asChild>
            <Link href="/assessment">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
