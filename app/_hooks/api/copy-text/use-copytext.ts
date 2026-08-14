"use client"

import { useState, useEffect, useCallback } from 'react'
import type { ApiResponse } from '@/lib/api-response'
import type { ICopyText } from '@/types/copyText'

export function useCopyText(id: string | number) {
  const [copyText, setCopyText] = useState<ICopyText | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCopyText = useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/copy-text/${id}`)
      const result: ApiResponse<ICopyText> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch copy text')
      }
      
      setCopyText(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setCopyText(null)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCopyText()
  }, [fetchCopyText])

  return {
    copyText,
    isLoading,
    error,
    refreshCopyText: fetchCopyText,
  }
}