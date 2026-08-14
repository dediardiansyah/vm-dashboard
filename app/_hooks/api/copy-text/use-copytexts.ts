"use client"

import { useState, useEffect, useCallback } from 'react'
import { useApiRequest } from '@/app/_hooks/common/use-api-request'
import type { ICopyText } from '@/types/copyText'
import type { ICreateCopyText, IUpdateCopyText } from "@/schemas/copyTextSchema"
import { ApiResponse } from '@/lib/api-response'

const API_ENDPOINT = '/api/admin/copy-text'

interface UseCopyTextsParams {
  page?: number
  limit?: number
  search?: string
}

export function useCopyTexts({ page = 1, limit = 10, search = '' }: UseCopyTextsParams = {}) {
  const [copyTexts, setCopyTexts] = useState<ICopyText[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const { request } = useApiRequest()

  const fetchCopyTexts = useCallback(async () => {
    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {})
      })
      
      const response = await fetch(`/api/admin/copy-text?${searchParams}`)
      const result: ApiResponse<{ data: ICopyText[], total: number }> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch copy texts')
      }
      
      setCopyTexts(result.data.data)
      setTotal(result.data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, search])

  const createCopyText = async (copyTextData: ICreateCopyText) => {
    try {
      await request<ICopyText>(API_ENDPOINT, {
        method: 'POST',
        body: copyTextData,
      })
      await fetchCopyTexts()
      return true
    } catch {
      return false
    }
  }

  const updateCopyText = async (id: number, copyTextData: IUpdateCopyText) => {
    try {
      await request<ICopyText>(`${API_ENDPOINT}/${id}`, {
        method: 'PATCH',
        body: copyTextData,
      })
      await fetchCopyTexts()
      return true
    } catch (err) {
      throw err
    }
  }

  const deleteCopyText = async (id: number) => {
    try {
      await request<void>(`${API_ENDPOINT}/${id}`, {
        method: 'DELETE',
      })
      await fetchCopyTexts()
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    fetchCopyTexts()
  }, [fetchCopyTexts])

  return {
    copyTexts,
    isLoading,
    error,
    total,
    createCopyText,
    updateCopyText,
    deleteCopyText,
    refreshCopyTexts: fetchCopyTexts,
  }
}