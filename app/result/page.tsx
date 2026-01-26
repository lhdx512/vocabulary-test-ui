"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { ResultCard } from "@/components/result-card"
import { ErrorCard } from "@/components/error-card"
import { MethodAccordion } from "@/components/method-accordion"
import { Button } from "@/components/ui/button"
import { Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const score = Number.parseInt(searchParams.get("score") || "3000")

  const error = Math.floor(score * 0.08) // 8% error range
  const targetError = Math.floor(score * 0.05) // Target 5% error
  const additionalSentences = Math.floor(Math.random() * 10) + 5 // Mock: 5-15 more sentences

  const handleRetry = () => {
    router.push("/test")
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/result?score=${score}`
    navigator.clipboard.writeText(url)
    toast({
      title: "已复制",
      description: "结果链接已复制到剪贴板",
    })
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">测试完成</h1>
          <p className="text-muted-foreground">以下是您的词汇量评估结果</p>
        </div>

        <ResultCard score={score} />

        <ErrorCard error={error} targetError={targetError} additionalSentences={additionalSentences} />

        <MethodAccordion />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRetry} size="lg" className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" />
            再测一次
          </Button>
          <Button onClick={handleCopyLink} variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
            <Copy className="mr-2 h-4 w-4" />
            复制结果链接
          </Button>
        </div>

        <div className="text-center">
          <Button variant="link" onClick={() => router.push("/")}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  )
}
