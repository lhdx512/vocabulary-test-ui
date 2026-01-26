import { Card } from "@/components/ui/card"

interface ResultCardProps {
  score: number
}

export function ResultCard({ score }: ResultCardProps) {
  return (
    <Card className="p-8 md:p-12 text-center">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wide">您的词汇量</p>
        <div className="space-y-2">
          <p className="text-6xl md:text-7xl font-bold text-balance">约 {score.toLocaleString()}</p>
          <p className="text-2xl md:text-3xl text-muted-foreground">个词族</p>
        </div>
        <p className="text-sm text-muted-foreground pt-4">基于语境理解的词汇量估算</p>
      </div>
    </Card>
  )
}
