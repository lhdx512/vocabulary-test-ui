import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

interface ConfidenceCardProps {
  level: "high" | "medium" | "low"
}

export function ConfidenceCard({ level }: ConfidenceCardProps) {
  const config = {
    high: {
      icon: CheckCircle2,
      label: "高可信度",
      description: "您的回答一致性高，结果较为准确",
      color: "text-green-600 dark:text-green-400",
    },
    medium: {
      icon: Info,
      label: "中等可信度",
      description: "结果具有一定参考价值，建议多次测试取平均值",
      color: "text-blue-600 dark:text-blue-400",
    },
    low: {
      icon: AlertCircle,
      label: "较低可信度",
      description: "回答一致性较低，建议重新测试以获得更准确的结果",
      color: "text-orange-600 dark:text-orange-400",
    },
  }

  const { icon: Icon, label, description, color } = config[level]

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className={color}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  )
}
