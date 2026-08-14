import { useState, useEffect } from 'react'
import type { ApiResponse } from '@/lib/api-response'
import type { IUser } from '@/types/user'

export function useUsers() {
  const [users, setUsers] = useState<IUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const result: ApiResponse<IUser[]> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch users')
      }
      
      setUsers(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async (userData: Partial<IUser>) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      
      const result: ApiResponse<IUser> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create user')
      }
      
      await fetchUsers()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  const updateUser = async (id: number, userData: Partial<IUser>) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      if (!response.ok) throw new Error('Failed to update user')
      await fetchUsers() // Refresh the list
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  const deleteUser = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete user')
      await fetchUsers() // Refresh the list
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: fetchUsers,
  }
}