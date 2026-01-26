"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ClickableWordProps {
  word: string
  translation?: string
  isSelected: boolean
  onClick: () => void
  showTranslation: boolean
  containerRef?: React.RefObject<HTMLElement>
  bubbleNudgePx?: number
}

type Placement = "top" | "bottom"

export function ClickableWord({
  word,
  translation,
  isSelected,
  onClick,
  showTranslation,
  containerRef,
  bubbleNudgePx = 0,
}: ClickableWordProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [placement, setPlacement] = useState<Placement>("top")

  useLayoutEffect(() => {
    // Only decide placement when the reveal is showing AND this word is selected.
    if (!showTranslation || !isSelected) return
    if (!btnRef.current || !containerRef?.current) return

    const w = btnRef.current.getBoundingClientRect()
    const c = containerRef.current.getBoundingClientRect()

    const wordCenterY = w.top + w.height / 2
    const containerCenterY = c.top + c.height / 2

    // Upper half -> show above; lower half -> show below
    setPlacement(wordCenterY < containerCenterY ? "top" : "bottom")
  }, [showTranslation, isSelected, containerRef])

  const bubbleStyle: React.CSSProperties = {
    transform: `translateX(calc(-50% + ${bubbleNudgePx}px))`,
  }

  return (
    <span className="relative inline-block align-baseline">
      {showTranslation && isSelected && translation && (
        <span
          className={cn(
            "pointer-events-none absolute left-1/2 z-20 bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap shadow-sm",
            "animate-in fade-in zoom-in-95 duration-200",
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2",
          )}
          style={bubbleStyle}
        >
          {translation}
          {placement === "top" ? (
            <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary" />
          ) : (
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-primary" />
          )}
        </span>
      )}

      <button
        ref={btnRef}
        onClick={onClick}
        disabled={showTranslation} // reveal阶段锁定本句选择
        className={cn(
          "relative inline-flex items-center px-1 rounded transition-all cursor-pointer hover:bg-accent",
          isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
          showTranslation && "cursor-default",
        )}
      >
        {word}
      </button>
    </span>
  )
}
