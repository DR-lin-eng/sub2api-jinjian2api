/**
 * Authentication state for the single local administrator.
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  authAPI,
  isTotp2FARequired,
  type LoginResponse,
  type RefreshTokenResponse
} from '@/features/auth/data/datasources/authDatasource'
import {
  clearTokenMemory,
  setAccessToken,
  setRefreshTokenMemory,
  setTokenExpiresAtMemory
} from '@/core/networks/tokenStore'
import { passkeyAPI } from '@/features/passkeys/data/datasources/passkeyDatasource'
import type { AuthResponse, LoginRequest, User } from '@/types'

const AUTH_USER_KEY = 'auth_user'
const AUTO_REFRESH_INTERVAL = 60 * 1000
const TOKEN_REFRESH_BUFFER = 120 * 1000

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const tokenExpiresAt = ref<number | null>(null)

  let refreshIntervalID: ReturnType<typeof setInterval> | null = null
  let tokenRefreshTimeoutID: ReturnType<typeof setTimeout> | null = null
  let authCheckPromise: Promise<void> | null = null

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function stopAutoRefresh(): void {
    if (refreshIntervalID) {
      clearInterval(refreshIntervalID)
      refreshIntervalID = null
    }
  }

  function startAutoRefresh(): void {
    stopAutoRefresh()
    refreshIntervalID = setInterval(() => {
      if (token.value) {
        void refreshUser().catch((error) => {
          console.error('Auto-refresh administrator failed:', error)
        })
      }
    }, AUTO_REFRESH_INTERVAL)
  }

  function stopTokenRefresh(): void {
    if (tokenRefreshTimeoutID) {
      clearTimeout(tokenRefreshTimeoutID)
      tokenRefreshTimeoutID = null
    }
  }

  function scheduleTokenRefreshAt(expiresAt: number): void {
    stopTokenRefresh()
    const refreshIn = Math.max(0, expiresAt - Date.now() - TOKEN_REFRESH_BUFFER)
    tokenRefreshTimeoutID = setTimeout(() => {
      void performTokenRefresh()
    }, refreshIn)
  }

  function scheduleTokenRefresh(expiresIn: number): void {
    const expiresAt = Date.now() + expiresIn * 1000
    tokenExpiresAt.value = expiresAt
    setTokenExpiresAtMemory(expiresAt)
    scheduleTokenRefreshAt(expiresAt)
  }

  async function performTokenRefresh(): Promise<void> {
    try {
      const response = await authAPI.refreshToken()
      token.value = response.access_token
      setAccessToken(response.access_token)
      if (response.refresh_token) {
        setRefreshTokenMemory(response.refresh_token)
      }
      scheduleTokenRefresh(response.expires_in)
    } catch (error) {
      console.error('Token refresh failed:', error)
    }
  }

  function setAuthFromResponse(response: AuthResponse | RefreshTokenResponse): void {
    token.value = response.access_token
    setAccessToken(response.access_token)
    if (response.refresh_token) {
      setRefreshTokenMemory(response.refresh_token)
    }

    if ('user' in response) {
      user.value = response.user
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user))
    }

    startAutoRefresh()
    if (response.expires_in) {
      scheduleTokenRefresh(response.expires_in)
    }
  }

  function clearAuth(): void {
    stopAutoRefresh()
    stopTokenRefresh()
    token.value = null
    tokenExpiresAt.value = null
    user.value = null
    clearTokenMemory()
    localStorage.removeItem(AUTH_USER_KEY)
  }

  async function checkAuth(): Promise<void> {
    if (token.value && user.value) {
      return
    }
    if (authCheckPromise) {
      return authCheckPromise
    }

    authCheckPromise = (async () => {
      const savedUser = localStorage.getItem(AUTH_USER_KEY)
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser) as User
        } catch {
          localStorage.removeItem(AUTH_USER_KEY)
        }
      }

      try {
        setAuthFromResponse(await authAPI.refreshToken())
      } catch {
        clearAuth()
        return
      }

      try {
        await refreshUser()
      } catch {
        // Keep a freshly restored session on transient profile failures.
      }
    })().finally(() => {
      authCheckPromise = null
    })

    return authCheckPromise
  }

  async function login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authAPI.login(credentials)
      if (!isTotp2FARequired(response)) {
        setAuthFromResponse(response)
      }
      return response
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  async function login2FA(tempToken: string, totpCode: string): Promise<User> {
    try {
      const response = await authAPI.login2FA({
        temp_token: tempToken,
        totp_code: totpCode
      })
      setAuthFromResponse(response)
      return user.value!
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  async function loginWithPasskey(): Promise<User> {
    try {
      const response = await passkeyAPI.login()
      setAuthFromResponse(response)
      return user.value!
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  async function logout(): Promise<void> {
    try {
      await authAPI.logout()
    } catch (error) {
      console.warn('Logout API call failed, clearing local session anyway', error)
    } finally {
      clearAuth()
    }
  }

  async function refreshUser(): Promise<User> {
    if (!token.value) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await authAPI.getCurrentUser()
      user.value = response.data
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data))
      return response.data
    } catch (error) {
      if ((error as { status?: number }).status === 401) {
        clearAuth()
      }
      throw error
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    loginWithPasskey,
    login2FA,
    logout,
    checkAuth,
    refreshUser
  }
})
