import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">语境词义词汇量测试</h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">按词族估算，更贴近真实阅读</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto text-base">
              <Link href="/test">开始测试（约3–5分钟）</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base bg-transparent">
              <Link href="/test?example=true">查看示例</Link>
            </Button>
          </div>

          <div className="pt-8">
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              我们重视您的隐私。测试数据仅用于估算词汇量，不会被存储或分享。测试完全匿名，您可以随时退出。
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t">
        <p>© 2026 语境词义词汇量测试</p>
      </footer>
    </div>
  )
}
