import { ChangeEvent, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import { ImagePlus, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onChange: (file: File) => void
  accept?: string
  maxSize?: number
  className?: string
  defaultPreview?: string
  error?: boolean
  disabled?: boolean
}

export function ImageUpload({
  onChange,
  accept = 'image/*',
  maxSize = 5242880, // 5MB
  className,
  defaultPreview,
  error,
  disabled
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(defaultPreview || '')
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      console.error('File must be an image')
      return
    }

    if (file.size > maxSize) {
      console.error('File is too large')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    onChange(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const removeImage = () => {
    setPreview('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
        dragActive && 'border-primary bg-primary/5',
        error && 'border-red-500',
        disabled && 'cursor-not-allowed opacity-60',
        !preview && 'hover:border-primary/50',
        className
      )}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
    >
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="relative aspect-video w-full">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="rounded-lg object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <ImagePlus className="mb-2 h-10 w-10 text-muted-foreground" />
          <div className="mb-2 text-sm font-medium">
            Drop your image here, or{' '}
            <span className="text-primary hover:underline">browse</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
          </div>
        </div>
      )}
    </div>
  )
}