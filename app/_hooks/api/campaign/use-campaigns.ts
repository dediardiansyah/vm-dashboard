"use client"

import { useState, useEffect } from 'react'
import type { ApiResponse } from '@/lib/api-response'
import type { ICampaign } from '@/types/campaign'
import { ICreateCampaign, IUpdateCampaign } from "@/schemas/campaignSchema"

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/campaigns')
      const result: ApiResponse<ICampaign[]> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch campaigns')
      }
      
      setCampaigns(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const createCampaign = async (campaignData: ICreateCampaign) => {
    try {
      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      })
      
      const result: ApiResponse<ICampaign> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create campaign')
      }
      
      await fetchCampaigns()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  const updateCampaign = async (id: number, campaignData: IUpdateCampaign) => {
    try {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      })
      if (!response.ok) throw new Error('Failed to update campaign')
      await fetchCampaigns()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  const deleteCampaign = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete campaign')
      await fetchCampaigns()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  return {
    campaigns,
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refreshCampaigns: fetchCampaigns,
  }
}