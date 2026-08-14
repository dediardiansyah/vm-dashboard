import { Button } from "./ui/button"
import { DialogFooter } from "./ui/dialog"

interface DialogActionsProps {
    onCancel: () => void
    onConfirm: () => void
    confirmLabel?: string
    confirmVariant?: "default" | "destructive"
  }
  
  export function DialogActions({ 
    onCancel, 
    onConfirm, 
    confirmLabel = "Confirm",
    confirmVariant = "default" 
  }: DialogActionsProps) {
    return (
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    )
  }