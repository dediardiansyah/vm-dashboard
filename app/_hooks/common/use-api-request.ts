"use client"

import { useState } from 'react'
import type { ApiResponse } from '@/lib/api-response'

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

export function useApiRequest() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = async <T>(endpoint: string, config?: RequestConfig): Promise<T | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(endpoint, {
        method: config?.method || 'GET',
        headers: config?.body ? { 'Content-Type': 'application/json' } : undefined,
        body: config?.body ? JSON.stringify(config.body) : undefined,
      })

      const result: ApiResponse<T> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Operation failed')
      }

      return result.data || null
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { request, isLoading, error, setError }
}