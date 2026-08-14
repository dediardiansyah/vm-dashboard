import { useToast } from "@/app/_hooks/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"


interface ToastOptions {
  action?: {
    label: string
    altText: string
    onClick?: () => void
  }
}

export function useToastHandler() {
  const { toast } = useToast()

  const showSuccessToast = (title: string, description: string, options?: ToastOptions) => {
    toast({
      title,
      description,
      variant: "default",
      action: options?.action ? (
        <ToastAction altText={options.action.altText} onClick={options.action.onClick}>
          {options.action.label}
        </ToastAction>
      ) : undefined,
    })
  }

  const showErrorToast = (title: string, description: string, options?: ToastOptions) => {
    toast({
      title,
      description,
      variant: "destructive",
      action: options?.action ? (
        <ToastAction altText={options.action.altText} onClick={options.action.onClick}>
          {options.action.label}
        </ToastAction>
      ) : undefined,
    })
  }

  return { showSuccessToast, showErrorToast }
}