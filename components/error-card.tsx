import { Card } from "@/components/ui/card"
import { TrendingDown } from "lucide-react"

interface ErrorCardProps {
  error: number
  targetError: number
  additionalSentences: number
}

export function ErrorCard({ error, targetError, additionalSentences }: ErrorCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="text-orange-600 dark:text-orange-400">
          <TrendingDown className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold">误差范围</h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold">±{error}</p>
            <p className="text-sm text-muted-foreground">
              再测 <span className="font-semibold text-foreground">{additionalSentences}</span> 句可将误差降低到{" "}
              <span className="font-semibold text-foreground">±{targetError}</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
