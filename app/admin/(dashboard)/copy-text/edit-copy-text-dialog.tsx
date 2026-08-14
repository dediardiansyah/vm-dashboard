"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { updateCopyTextSchema, type IUpdateCopyText } from "@/schemas/copyTextSchema"
import { validateForm } from "@/lib/utils/validate-form"
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor"
import { cn } from "@/lib/utils/cn"
import { DialogFooter } from "@/components/ui/dialog"

interface EditCopyTextDialogProps {
  copyText: {
    id: number
    type: string
    content: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (id: number, data: IUpdateCopyText) => Promise<void>
}

interface FormErrors {
  type?: string
  content?: string
  general?: string
}

export function EditCopyTextDialog({ copyText, open, onOpenChange, onSubmit }: EditCopyTextDialogProps) {
  const [formData, setFormData] = useState<IUpdateCopyText>({
    type: "",
    content: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (copyText) {
      setFormData({
        type: copyText.type,
        content: copyText.content,
      })
    }
  }, [copyText])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!copyText) return

    const { isValid, errors: validationErrors } = validateForm(updateCopyTextSchema, formData)
    if (!isValid) {
      setErrors(validationErrors as FormErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(copyText.id, formData)
      setErrors({})
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Failed to update copy text"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Copy Text</DialogTitle>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => {
                setFormData({ ...formData, type: e.target.value })
                if (errors.type) setErrors({ ...errors, type: undefined })
              }}
              placeholder="Enter type..."
              className={cn(errors.type && "border-red-500")}
              disabled={isSubmitting}
            />
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <WysiwygEditor
              value={formData.content || ""}
              onChange={(e) => {
                setFormData({ ...formData, content: e })
                if (errors.content) setErrors({ ...errors, content: undefined })
              }}
              placeholder="Enter content..."
              className={cn(errors.content && "border-red-500")}
              disabled={isSubmitting}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
