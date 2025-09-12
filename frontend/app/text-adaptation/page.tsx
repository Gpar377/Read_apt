import { TextAdaptationTool } from "@/components/text-adaptation-tool"
import { MainLayout } from "@/components/templates/MainLayout"

export default function TextAdaptationPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <TextAdaptationTool />
      </div>
    </MainLayout>
  )
}