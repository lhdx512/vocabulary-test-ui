// app/test/page.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProgressHeader } from "@/components/progress-header"
import { SentenceCard } from "@/components/sentence-card"
import { Button } from "@/components/ui/button"
import sentences from "@/data/sentences.v1.json"

type Sentence = {
  id: number
  text: string
  translation: string
  wordTranslations: Record<string, string>
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max))
}

export default function TestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isExample = searchParams.get("example") === "true"

  // JSON import typing: widen to a stable shape (no runtime impact)
  const sentenceList = sentences as unknown as Sentence[]

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set())
  const [sentencesCompleted, setSentencesCompleted] = useState(0)
  const [progress, setProgress] = useState(0)

  // reveal 状态：显示中文反馈（整句 + 选中词释义气泡）
  const [showTranslation, setShowTranslation] = useState(false)

  // 累计选词数（仅用于 demo 的 mock score）
  const [totalSelectedWords, setTotalSelectedWords] = useState(0)

  // 防止重复推进 & 支持“跳过翻译”
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const advancingRef = useRef(false)

  const currentSentence = sentenceList[currentSentenceIndex]
  const remainingSentences = sentenceList.length - sentencesCompleted

  useEffect(() => {
    setProgress((sentencesCompleted / sentenceList.length) * 100)
  }, [sentencesCompleted])

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
    }
  }, [])

  const handleExit = () => {
    if (confirm("确定要退出测试吗？进度将不会保存。")) {
      router.push("/")
    }
  }

  const handleWordClick = (word: string) => {
    // reveal 阶段锁定本句，不允许再改
    if (showTranslation) return

    setSelectedWords((prev) => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }

  const calculateRevealDurationMs = () => {
    // 句子中文长度
    const L = currentSentence.translation.length ?? 0

    // 选中词数
    const n = selectedWords.size

    // 选中词释义中文总长度（可选；没有也不影响）
    let W = 0
    selectedWords.forEach((w) => {
      const key = w.toLowerCase()
      const t = currentSentence.wordTranslations[key]
      if (t) W += t.length
    })

    // 句子时间：权重低 + 上限，避免 n=0 还很慢
    const tSent = clamp(0.75 + 0.008 * L, 0.9, 1.15)

    // 句子 ↔ 词义切换成本
    const tSwitch = n > 0 ? 0.25 : 0

    // 词义时间：给足（n 多/释义长时不会来不及看）
    const tWords = 0.3 * n + 0.05 * W

    const t = clamp(tSent + tSwitch + tWords, 0.9, 4.0)
    return Math.round(t * 1000)
  }

  const calculateScore = (finalTotalSelectedWords: number) => {
    // Mock score：你后续在 Cursor 里替换为真实估算
    const baseScore = 3000
    return baseScore + finalTotalSelectedWords * 25 + Math.floor(Math.random() * 300)
  }

  const advanceToNext = () => {
    if (advancingRef.current) return
    advancingRef.current = true

    // 清理定时器
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }

    // 结束 reveal
    setShowTranslation(false)

    // 结算本句
    const thisSelectedCount = selectedWords.size
    const finalTotal = totalSelectedWords + thisSelectedCount

    setTotalSelectedWords((prev) => prev + thisSelectedCount)
    setSentencesCompleted((prev) => prev + 1)

    // 下一句 / 结束
    if (currentSentenceIndex < sentenceList.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1)
      setSelectedWords(new Set())
      requestAnimationFrame(() => {
        advancingRef.current = false
      })
    } else {
      router.push(`/result?score=${calculateScore(finalTotal)}`)
    }
  }

  const handleNextClick = () => {
    // reveal 中：按钮可点，点击=跳过翻译
    if (showTranslation) {
      advanceToNext()
      return
    }

    // 开始 reveal
    setShowTranslation(true)

    const durationMs = calculateRevealDurationMs()
    revealTimerRef.current = setTimeout(() => {
      advanceToNext()
    }, durationMs)
  }

  const nextButtonLabel = showTranslation ? "跳过翻译" : "下一句"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressHeader progress={progress} remainingSentences={remainingSentences} onExit={handleExit} />

      <main className="flex-1 flex items-center justify-center px-4 py-8 pb-24 sm:pb-8">
        <div className="max-w-3xl w-full">
          {isExample && (
            <div className="mb-6 p-4 bg-accent rounded-lg border">
              <p className="text-sm text-muted-foreground">
                <strong>示例模式：</strong>点击句子中你不确定意思的单词，然后点击“下一句”继续。
              </p>
            </div>
          )}

          <SentenceCard
            sentence={currentSentence.text}
            translation={currentSentence.translation}
            wordTranslations={currentSentence.wordTranslations}
            selectedWords={selectedWords}
            onWordClick={handleWordClick}
            showTranslation={showTranslation}
          />

          <div className="mt-8 flex justify-center">
            <Button onClick={handleNextClick} size="lg" className="w-full sm:w-auto">
              {nextButtonLabel}
            </Button>
          </div>
        </div>
      </main>

      {/* Mobile fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden">
        <Button onClick={handleNextClick} size="lg" className="w-full">
          {nextButtonLabel}
        </Button>
      </div>

      {/* 已关闭理解校验：不再渲染 ComprehensionModal */}
    </div>
  )
}
