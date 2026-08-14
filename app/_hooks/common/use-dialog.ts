import { useState, useCallback } from 'react'

interface UseDialogProps {
  initialState?: boolean
  onClose?: () => void
}

export function useDialog({ initialState = false, onClose }: UseDialogProps = {}) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  }
}