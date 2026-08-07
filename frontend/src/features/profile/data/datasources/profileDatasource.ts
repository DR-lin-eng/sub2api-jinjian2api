/**
 * Local administrator profile endpoints.
 */

import { apiClient } from '@/core/networks/client'
import type { ChangePasswordRequest, User } from '@/types'

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<User>('/user/profile')
  return data
}

export async function updateProfile(profile: {
  username?: string
  avatar_url?: string | null
}): Promise<User> {
  const { data } = await apiClient.put<User>('/user', profile)
  return data
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const payload: ChangePasswordRequest = {
    old_password: oldPassword,
    new_password: newPassword
  }
  const { data } = await apiClient.put<{ message: string }>('/user/password', payload)
  return data
}

export const userAPI = {
  getProfile,
  updateProfile,
  changePassword
}

export default userAPI
