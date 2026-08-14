"use client"

import { useState, useEffect } from 'react'
import { useApiRequest } from '@/app/_hooks/common/use-api-request'
import { ICreateParfume } from '@/schemas/parfumeSchema'
import { IParfume } from '@/types/parfume'
import { IUpdateParfume } from '@/schemas/parfumeSchema'

const API_ENDPOINT = '/api/admin/parfumes'

export function useParfumes() {
  const [parfumes, setParfumes] = useState<IParfume[]>([])
  const { request, isLoading, error, setError } = useApiRequest()

  const fetchParfumes = async () => {
    try {
      const data = await request<IParfume[]>(API_ENDPOINT)
      setParfumes(data || [])
    } catch (err) {
      setParfumes([])
    }
  }

  const createParfume = async (parfumeData: ICreateParfume) => {
    try {
      await request<IParfume>(API_ENDPOINT, {
        method: 'POST',
        body: parfumeData,
      })
      await fetchParfumes()
      return true
    } catch {
      return false
    }
  }

  const updateParfume = async (id: number, parfumeData: IUpdateParfume) => {
    try {
      await request<IParfume>(`${API_ENDPOINT}/${id}`, {
        method: 'PATCH',
        body: parfumeData,
      })
      await fetchParfumes()
      return true
    } catch (err) {
      throw err
    }
  }

  const deleteParfume = async (id: number) => {
    try {
      await request<void>(`${API_ENDPOINT}/${id}`, {
        method: 'DELETE',
      })
      await fetchParfumes()
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    fetchParfumes()
  }, [])

  return {
    parfumes,
    isLoading,
    error,
    createParfume,
    updateParfume,
    deleteParfume,
    refreshParfumes: fetchParfumes,
  }
}