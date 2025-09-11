import { MainLayout } from "@/components/templates/MainLayout"
import { AssessmentSelector } from "@/components/assessments/AssessmentSelector"

export default function AssessmentPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <AssessmentSelector />
      </div>
    </MainLayout>
  )
}
