// app/test/page.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProgressHeader } from "@/components/progress-header"
import { SentenceCard } from "@/components/sentence-card"
import { Button } from "@/components/ui/button"

// Mock sentence data with translations
const sentences = [
  {
    id: 1,
    text: "The ancient manuscript contained numerous fascinating revelations about medieval society.",
    translation: "这份古老的手稿包含了许多关于中世纪社会的迷人发现。",
    wordTranslations: {
      ancient: "古老的",
      manuscript: "手稿",
      contained: "包含",
      numerous: "许多的",
      fascinating: "迷人的",
      revelations: "揭示，发现",
      medieval: "中世纪的",
      society: "社会",
    },
  },
  {
    id: 2,
    text: "Scientists discovered remarkable evidence suggesting unprecedented changes in climate patterns.",
    translation: "科学家发现了显著的证据，表明气候模式发生了前所未有的变化。",
    wordTranslations: {
      scientists: "科学家",
      discovered: "发现",
      remarkable: "显著的",
      evidence: "证据",
      suggesting: "表明",
      unprecedented: "前所未有的",
      changes: "变化",
      climate: "气候",
      patterns: "模式",
    },
  },
  {
    id: 3,
    text: "The committee deliberated extensively before reaching their conclusive determination.",
    translation: "委员会在达成最终决定之前进行了广泛的讨论。",
    wordTranslations: {
      committee: "委员会",
      deliberated: "讨论，审议",
      extensively: "广泛地",
      reaching: "达成",
      conclusive: "最终的",
      determination: "决定",
    },
  },
  {
    id: 4,
    text: "Her eloquent presentation demonstrated extraordinary comprehension of complex theoretical concepts.",
    translation: "她雄辩的演讲展示了对复杂理论概念的非凡理解。",
    wordTranslations: {
      eloquent: "雄辩的",
      presentation: "演讲，展示",
      demonstrated: "展示",
      extraordinary: "非凡的",
      comprehension: "理解",
      complex: "复杂的",
      theoretical: "理论的",
      concepts: "概念",
    },
  },
  {
    id: 5,
    text: "The archaeological expedition uncovered magnificent artifacts from forgotten civilizations.",
    translation: "考古探险队发掘出了被遗忘文明的壮丽文物。",
    wordTranslations: {
      archaeological: "考古的",
      expedition: "探险队",
      uncovered: "发掘",
      magnificent: "壮丽的",
      artifacts: "文物",
      forgotten: "被遗忘的",
      civilizations: "文明",
    },
  },
  {
    id: 6,
    text: "Researchers implemented innovative methodologies to investigate these perplexing phenomena.",
    translation: "研究人员实施了创新的方法来调查这些令人困惑的现象。",
    wordTranslations: {
      researchers: "研究人员",
      implemented: "实施",
      innovative: "创新的",
      methodologies: "方法论",
      investigate: "调查",
      perplexing: "令人困惑的",
      phenomena: "现象",
    },
  },
  {
    id: 7,
    text: "The administration established comprehensive regulations governing institutional procedures.",
    translation: "管理部门制定了管理机构程序的全面法规。",
    wordTranslations: {
      administration: "管理部门",
      established: "建立",
      comprehensive: "全面的",
      regulations: "法规",
      governing: "管理",
      institutional: "机构的",
      procedures: "程序",
    },
  },
  {
    id: 8,
    text: "Economic indicators revealed substantial fluctuations throughout consecutive quarters.",
    translation: "经济指标显示了连续几个季度的重大波动。",
    wordTranslations: {
      economic: "经济的",
      indicators: "指标",
      revealed: "显示",
      substantial: "重大的",
      fluctuations: "波动",
      throughout: "贯穿",
      consecutive: "连续的",
      quarters: "季度",
    },
  },
  {
    id: 9,
    text: "The philosopher articulated profound insights regarding contemporary existential questions.",
    translation: "这位哲学家阐述了关于当代存在主义问题的深刻见解。",
    wordTranslations: {
      philosopher: "哲学家",
      articulated: "阐述",
      profound: "深刻的",
      insights: "见解",
      regarding: "关于",
      contemporary: "当代的",
      existential: "存在主义的",
      questions: "问题",
    },
  },
  {
    id: 10,
    text: "Engineers developed sophisticated mechanisms for monitoring environmental conditions.",
    translation: "工程师开发了用于监测环境条件的复杂机制。",
    wordTranslations: {
      engineers: "工程师",
      developed: "开发",
      sophisticated: "复杂的",
      mechanisms: "机制",
      monitoring: "监测",
      environmental: "环境的",
      conditions: "条件",
    },
  },
]

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max))
}

export default function TestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isExample = searchParams.get("example") === "true"

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

  const currentSentence = sentences[currentSentenceIndex]
  const remainingSentences = sentences.length - sentencesCompleted

  useEffect(() => {
    setProgress((sentencesCompleted / sentences.length) * 100)
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
    const L = currentSentence.translation?.length ?? 0

    // 选中词数
    const n = selectedWords.size

    // 选中词释义中文总长度（可选；没有也不影响）
    let W = 0
    selectedWords.forEach((w) => {
      const key = w.toLowerCase()
      const t = currentSentence.wordTranslations?.[key]
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
    if (currentSentenceIndex < sentences.length - 1) {
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
