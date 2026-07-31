import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AuthActionRepository } from '@/features/auth/domain/repositories/authActionRepository'
import { authActionRepository as default_repo } from '@/features/auth/data/repositories/authActionRepositoryImpl'

export function createAuthActionStore(repo: AuthActionRepository = default_repo) {
  return defineStore('auth/action', () => {
    const loading = reactive<Record<string, boolean>>({
      login: false, login2FA: false, register: false, logout: false,
      sendVerifyCode: false, sendPendingOAuthVerifyCode: false,
      forgotPassword: false, resetPassword: false,
      validatePromoCode: false, validateInvitationCode: false,
      refreshToken: false, revokeAllSessions: false,
      prepareOAuthBindAccessTokenCookie: false,
      completePendingOAuthBindLogin: false, createPendingOAuthAccount: false,
    })
    const errors = reactive<Record<string, unknown>>({
      login: null, login2FA: null, register: null, logout: null,
      sendVerifyCode: null, sendPendingOAuthVerifyCode: null,
      forgotPassword: null, resetPassword: null,
      validatePromoCode: null, validateInvitationCode: null,
      refreshToken: null, revokeAllSessions: null,
      prepareOAuthBindAccessTokenCookie: null,
      completePendingOAuthBindLogin: null, createPendingOAuthAccount: null,
    })

    function wrap<K extends keyof AuthActionRepository>(key: K): AuthActionRepository[K] {
      return ((...args: unknown[]) => {
        (loading as Record<string, boolean>)[key as string] = true
        ;(errors as Record<string, unknown>)[key as string] = null
        return Promise.resolve()
          .then(() => (repo[key] as (...a: unknown[]) => unknown)(...args))
          .catch((e: unknown) => { (errors as Record<string, unknown>)[key as string] = e; throw e })
          .finally(() => { (loading as Record<string, boolean>)[key as string] = false })
      }) as AuthActionRepository[K]
    }

    const login = wrap('login')
    const login2FA = wrap('login2FA')
    const register = wrap('register')
    const logout = wrap('logout')
    const sendVerifyCode = wrap('sendVerifyCode')
    const sendPendingOAuthVerifyCode = wrap('sendPendingOAuthVerifyCode')
    const forgotPassword = wrap('forgotPassword')
    const resetPassword = wrap('resetPassword')
    const validatePromoCode = wrap('validatePromoCode')
    const validateInvitationCode = wrap('validateInvitationCode')
    const refreshToken = wrap('refreshToken')
    const revokeAllSessions = wrap('revokeAllSessions')
    const prepareOAuthBindAccessTokenCookie = wrap('prepareOAuthBindAccessTokenCookie')
    const completePendingOAuthBindLogin = wrap('completePendingOAuthBindLogin')
    const createPendingOAuthAccount = wrap('createPendingOAuthAccount')

    return {
      loading, errors,
      login, login2FA, register, logout,
      sendVerifyCode, sendPendingOAuthVerifyCode,
      forgotPassword, resetPassword,
      validatePromoCode, validateInvitationCode,
      refreshToken, revokeAllSessions,
      prepareOAuthBindAccessTokenCookie,
      completePendingOAuthBindLogin,
      createPendingOAuthAccount,
    }
  })
}

export const useAuthActionStore = createAuthActionStore()
