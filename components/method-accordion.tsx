import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function MethodAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="method">
        <AccordionTrigger className="text-left">测试方法说明</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">什么是词族？</h4>
              <p>
                词族（word family）是指一组具有相同词根的相关单词。例如，"create"、"creation"、"creative"、"creator"
                属于同一个词族。 按词族计算比单纯统计单词数量更能反映真实的阅读能力。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">测试原理</h4>
              <p>
                本测试通过展示真实语境中的句子，让您标记不确定意思的单词。系统会根据您的选择和对句子的理解程度，
                结合统计模型估算您的词汇量。这种方法比传统的词汇测试更接近真实阅读场景。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">如何提高准确性</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>诚实地标记不确定意思的单词，不要猜测</li>
                <li>认真阅读每个句子，理解整体语境</li>
                <li>对理解程度的反馈要真实准确</li>
                <li>可以多次测试取平均值以提高准确性</li>
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
