"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { createCopyTextSchema, type ICreateCopyText } from "@/schemas/copyTextSchema"
import { validateForm } from "@/lib/utils/validate-form"
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor"
import { cn } from "@/lib/utils/cn"
import { DialogFooter } from "@/components/ui/dialog"

interface AddCopyTextDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ICreateCopyText) => Promise<void>
}

interface FormErrors {
  type?: string
  content?: string
  general?: string
}

export function AddCopyTextDialog({ open, onOpenChange, onSubmit }: AddCopyTextDialogProps) {
  const [formData, setFormData] = useState<ICreateCopyText>({
    type: "",
    content: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { isValid, errors: validationErrors } = validateForm(createCopyTextSchema, formData)
    if (!isValid) {
      setErrors(validationErrors as FormErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        type: "",
        content: "",
      })
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Failed to create copy text"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Copy Text</DialogTitle>
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
              value={formData.content}
              onChange={(value) => {
                setFormData({ ...formData, content: value })
                if (errors.content) setErrors({ ...errors, content: undefined })
              }}
              className={cn(errors.content && "border-red-500")}
              disabled={isSubmitting}
              placeholder="Enter content..."
              error={!!errors.content}
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
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}