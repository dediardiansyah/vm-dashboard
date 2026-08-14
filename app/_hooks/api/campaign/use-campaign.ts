import { useState, useEffect, useCallback } from 'react'
import { ICampaign } from '@/types/campaign'
import { ApiResponse } from '@/lib/api-response'

export function useCampaign(id: string | number) {
  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaign = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/campaigns/${id}`)
      const result: ApiResponse<ICampaign> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch campaign')
      }
      
      setCampaign(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCampaign()
  }, [fetchCampaign])

  return {
    campaign,
    isLoading,
    error,
    refreshCampaign: fetchCampaign,
  }
}
