import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/core/stores/appStore'
import { useAdminAccountsActionStore } from '@/features/admin-accounts/presentation/stores/adminAccountsActionStore'
import type { AntigravityTokenInfo } from '@/features/admin-accounts/domain/models/antigravityTokenInfo'

export function useAntigravityOAuth() {
  const appStore = useAppStore()
  const actionStore = useAdminAccountsActionStore()
  const { t } = useI18n()

  const authUrl = ref('')
  const sessionId = ref('')
  const state = ref('')
  const loading = ref(false)
  const error = ref('')

  const resetState = () => {
    authUrl.value = ''
    sessionId.value = ''
    state.value = ''
    loading.value = false
    error.value = ''
  }

  const generateAuthUrl = async (proxyId: number | null | undefined): Promise<boolean> => {
    loading.value = true
    authUrl.value = ''
    sessionId.value = ''
    state.value = ''
    error.value = ''

    try {
      const payload: Record<string, unknown> = {}
      if (proxyId) payload.proxyId = proxyId

      const response = await actionStore.antigravity_generateAuthUrl(payload as any)
      authUrl.value = response.authUrl
      sessionId.value = response.sessionId
      state.value = response.state
      return true
    } catch (err: any) {
      error.value =
        err.response?.data?.detail || t('admin.accounts.oauth.antigravity.failedToGenerateUrl')
      appStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  const exchangeAuthCode = async (params: {
    code: string
    sessionId: string
    state: string
    proxyId?: number | null
  }): Promise<AntigravityTokenInfo | null> => {
    const code = params.code?.trim()
    if (!code || !params.sessionId || !params.state) {
      error.value = t('admin.accounts.oauth.antigravity.missingExchangeParams')
      return null
    }

    loading.value = true
    error.value = ''

    try {
      const payload: Record<string, unknown> = {
        session_id: params.sessionId,
        state: params.state,
        code
      }
      if (params.proxyId) payload.proxyId = params.proxyId

      const tokenInfo = await actionStore.antigravity_exchangeCode(payload as any)
      return tokenInfo as AntigravityTokenInfo
    } catch (err: any) {
      error.value =
        err.response?.data?.detail || t('admin.accounts.oauth.antigravity.failedToExchangeCode')
      appStore.showError(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  const validateRefreshToken = async (
    refreshToken: string,
    proxyId?: number | null
  ): Promise<AntigravityTokenInfo | null> => {
    if (!refreshToken.trim()) {
      error.value = t('admin.accounts.oauth.antigravity.pleaseEnterRefreshToken')
      return null
    }

    loading.value = true
    error.value = ''

    try {
      const tokenInfo = await actionStore.refreshAntigravityToken(
        refreshToken.trim(),
        proxyId
      )
      return tokenInfo as AntigravityTokenInfo
    } catch (err: any) {
      error.value =
        err.response?.data?.detail || t('admin.accounts.oauth.antigravity.failedToValidateRT')
      // Don't show global error toast for batch validation to avoid spamming
      // appStore.showError(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  const buildCredentials = (
    tokenInfo: AntigravityTokenInfo,
    fallbackRefreshToken?: string
  ): Record<string, unknown> => {
    let expiresAt: string | undefined
    if (typeof (tokenInfo.expiresAt as unknown) === 'number' && Number.isFinite(tokenInfo.expiresAt as unknown)) {
      expiresAt = Math.floor(tokenInfo.expiresAt).toString()
    } else if (typeof (tokenInfo.expiresAt as unknown) === 'string' && (tokenInfo.expiresAt as unknown as string).trim()) {
      expiresAt = (tokenInfo.expiresAt as unknown as string).trim()
    }
    const refreshToken = tokenInfo.refreshToken?.trim()
      ? tokenInfo.refreshToken
      : fallbackRefreshToken

    return {
      access_token: tokenInfo.accessToken,
      refresh_token: refreshToken,
      token_type: tokenInfo.tokenType,
      expires_at: expiresAt,
      project_id: tokenInfo.projectId,
      email: tokenInfo.email
    }
  }

  return {
    authUrl,
    sessionId,
    state,
    loading,
    error,
    resetState,
    generateAuthUrl,
    exchangeAuthCode,
    validateRefreshToken,
    buildCredentials
  }
}
