"use client"

import { useState, useEffect } from 'react'
import { useApiRequest } from '@/app/_hooks/common/use-api-request'
import { ICreateMachine } from '@/schemas/machineSchema'
import { IMachine } from '@/types/machine'
import { IUpdateMachine } from '@/schemas/machineSchema'

const API_ENDPOINT = '/api/admin/machines'

export function useMachines() {
  const [machines, setMachines] = useState<IMachine[]>([])
  const { request, isLoading, error, setError } = useApiRequest()

  const fetchMachines = async () => {
    try {
      const data = await request<IMachine[]>(API_ENDPOINT)
      setMachines(data || [])
    } catch (err) {
      setMachines([])
    }
  }

  const createMachine = async (machineData: ICreateMachine) => {
    try {
      await request<IMachine>(API_ENDPOINT, {
        method: 'POST',
        body: machineData,
      })
      await fetchMachines()
      return true
    } catch {
      return false
    }
  }

  const updateMachine = async (id: number, machineData: IUpdateMachine) => {
    try {
      await request<IMachine>(`${API_ENDPOINT}/${id}`, {
        method: 'PATCH',
        body: machineData,
      })
      await fetchMachines()
      return true
    } catch (err) {
      throw err
    }
  }

  const deleteMachine = async (id: number) => {
    try {
      await request<void>(`${API_ENDPOINT}/${id}`, {
        method: 'DELETE',
      })
      await fetchMachines()
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  return {
    machines,
    isLoading,
    error,
    createMachine,
    updateMachine,
    deleteMachine,
    refreshMachines: fetchMachines,
  }
}