import { Brain } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold">ReadApt</span>
          </div>

          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>Empowering accessible reading for everyone</p>
            <p className="mt-1">© ReadApt. Built with accessibility in mind.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
