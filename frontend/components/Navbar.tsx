"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Brain className="w-6 h-6 text-primary" />
          <span>ReadApt</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/assessment">
            <Button variant="ghost" size="sm">Assessment</Button>
          </Link>
          <Link href="/text-adaptation">
            <Button variant="ghost" size="sm">Text Tool</Button>
          </Link>
          <Link href="/adaptation">
            <Button variant="ghost" size="sm">Settings</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}