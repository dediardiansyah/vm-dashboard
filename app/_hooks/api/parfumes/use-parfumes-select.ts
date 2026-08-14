"use client"

import { useState, useEffect } from 'react'
import { useApiRequest } from '@/app/_hooks/common/use-api-request'
import { IParfume } from '@/types/parfume'

export function useParfumesSelect() {
  const [parfumes, setParfumes] = useState<IParfume[]>([])
  const { request, isLoading } = useApiRequest()

  const fetchParfumes = async () => {
    try {
      const data = await request<IParfume[]>('/api/admin/parfumes')
      setParfumes(data || [])
    } catch (err) {
      setParfumes([])
    }
  }

  useEffect(() => {
    fetchParfumes()
  }, [])

  return {
    parfumes,
    isLoading,
  }
}