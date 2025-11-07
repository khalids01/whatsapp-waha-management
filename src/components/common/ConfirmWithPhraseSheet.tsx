"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type ConfirmWithPhraseSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  confirmPhrase: string
  confirming?: boolean
  error?: string | null
  onConfirm: () => void
}

export function ConfirmWithPhraseSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmPhrase,
  confirming,
  error,
  onConfirm,
}: ConfirmWithPhraseSheetProps) {
  const [text, setText] = React.useState("")
  const canConfirm = text.trim().toLowerCase() === confirmPhrase.trim().toLowerCase()

  React.useEffect(() => {
    if (!open) setText("")
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>

        <div className="p-4 pt-0 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="confirm-phrase">Type this phrase to confirm: {confirmPhrase}</Label>
            <Input
              id="confirm-phrase"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={confirmPhrase}
              aria-invalid={!canConfirm && text.length > 0}
            />
          </div>
          {error ? (
            <div className="text-destructive text-sm">{error}</div>
          ) : null}
        </div>

        <SheetFooter>
          <div className="flex w-full justify-end gap-2 p-4 pt-0">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={confirming}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={!canConfirm || !!confirming}
            >
              {confirming ? "Deleting…" : "Confirm Delete"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
