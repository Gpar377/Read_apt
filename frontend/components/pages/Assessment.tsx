"use client"

import { MainLayout } from "@/components/templates/MainLayout"
import { AssessmentForm } from "@/components/AssessmentForm"

export const Assessment = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Reading Assessment</h1>
            <p className="text-muted-foreground">
              Answer 5 quick questions to help us understand your reading preferences and challenges.
            </p>
          </div>
          <AssessmentForm />
        </div>
      </div>
    </MainLayout>
  )
}
