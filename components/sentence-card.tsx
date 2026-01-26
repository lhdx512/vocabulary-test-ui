"use client"

import { useRef } from "react"
import { Card } from "@/components/ui/card"
import { ClickableWord } from "./clickable-word"

interface SentenceCardProps {
  sentence: string
  translation: string
  wordTranslations: Record<string, string>
  selectedWords: Set<string>
  onWordClick: (word: string) => void
  showTranslation: boolean
}

export function SentenceCard({
  sentence,
  translation,
  wordTranslations,
  selectedWords,
  onWordClick,
  showTranslation,
}: SentenceCardProps) {
  // Split sentence into words while preserving punctuation
  const words = sentence.match(/\b[\w']+\b|[.,!?;]/g) || []

  // Identify content words (simplified: words longer than 4 letters)
  const contentWords = words.filter((word) => /^[a-zA-Z]{5,}$/.test(word))

  // Sentence container ref: used to decide tooltip placement (top/bottom)
  const sentenceAreaRef = useRef<HTMLDivElement>(null)

  return (
    <Card className="p-8 md:p-12">
      <div ref={sentenceAreaRef} className="text-lg md:text-xl leading-relaxed relative">
        {words.map((word, index) => {
          const isContentWord = contentWords.includes(word)

          if (isContentWord) {
            // small horizontal nudge to reduce overlap when multiple tooltips appear
            const nudgePx = ((index % 3) - 1) * 10 // -10, 0, +10 cycle

            const translationKeyLower = word.toLowerCase()
            const t = wordTranslations?.[translationKeyLower] ?? wordTranslations?.[word]

            return (
              <ClickableWord
                key={index}
                word={word}
                translation={t}
                isSelected={selectedWords.has(word)}
                onClick={() => onWordClick(word)}
                showTranslation={showTranslation}
                containerRef={sentenceAreaRef}
                bubbleNudgePx={nudgePx}
              />
            )
          }

          return (
            <span key={index}>
              {word}
              {index < words.length - 1 && !words[index + 1]?.match(/[.,!?;]/) && " "}
            </span>
          )
        })}
      </div>

      {showTranslation && (
        <div className="mt-6 pt-6 border-t animate-in fade-in duration-300">
          <p className="text-base text-muted-foreground leading-relaxed">{translation}</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          {showTranslation ? "正在显示翻译..." : `点击不确定意思的单词（已选择 ${selectedWords.size} 个）`}
        </p>
      </div>
    </Card>
  )
}
