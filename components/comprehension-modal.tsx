"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ComprehensionModalProps {
  open: boolean
  onResponse: (response: string) => void
}

export function ComprehensionModal({ open, onResponse }: ComprehensionModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>快速确认</DialogTitle>
          <DialogDescription>这句话你理解了吗？</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button onClick={() => onResponse("understand")} size="lg" className="w-full">
            读懂
          </Button>
          <Button onClick={() => onResponse("somewhat")} variant="outline" size="lg" className="w-full">
            大概懂
          </Button>
          <Button onClick={() => onResponse("not-much")} variant="outline" size="lg" className="w-full">
            不太懂
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
