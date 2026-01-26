"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProgressHeaderProps {
  progress: number
  remainingSentences: number
  onExit: () => void
}

export function ProgressHeader({ progress, remainingSentences, onExit }: ProgressHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">收敛度: {Math.round(progress)}%</span>
              <span className="text-sm text-muted-foreground">预计剩余: {remainingSentences} 句</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onExit}>
            <X className="h-5 w-5" />
            <span className="sr-only">退出测试</span>
          </Button>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </header>
  )
}
