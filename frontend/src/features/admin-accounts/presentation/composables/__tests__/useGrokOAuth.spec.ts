import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/core/stores/appStore', () => ({
  useAppStore: () => ({
    showError: vi.fn()
  })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const messages: Record<string, string> = {
        'admin.accounts.oauth.grok.failedToExchangeCode': 'Grok 授权码兑换失败',
        'admin.accounts.oauth.grok.errors.GROK_OAUTH_INVALID_STATE':
          'Grok OAuth state 与当前会话不匹配。请粘贴同一次生成的授权链接返回的回调 URL。'
      }
      return messages[key] ?? key
    }
  })
}))

// Mock the action-store singleton so useGrokOAuth (which calls
// useAdminAccountsActionStore() at composable entry) receives our stubs.
const {
  grokGenerateAuthUrl,
  grokExchangeCode,
  refreshGrokToken,
} = vi.hoisted(() => ({
  grokGenerateAuthUrl: vi.fn(),
  grokExchangeCode: vi.fn(),
  refreshGrokToken: vi.fn(),
}))

vi.mock('@/features/admin-accounts/presentation/stores/adminAccountsActionStore', () => ({
  useAdminAccountsActionStore: () => ({
    grok_generateAuthUrl: grokGenerateAuthUrl,
    grok_exchangeCode: grokExchangeCode,
    refreshGrokToken,
  }),
}))

import { useGrokOAuth } from '@/features/admin-accounts/presentation/composables/useGrokOAuth'

beforeEach(() => {
  setActivePinia(createPinia())
  grokGenerateAuthUrl.mockReset()
  grokExchangeCode.mockReset()
  refreshGrokToken.mockReset()
})

describe('useGrokOAuth.exchangeAuthCode', () => {
  it('shows a state mismatch recovery hint from structured backend errors', async () => {
    grokExchangeCode.mockRejectedValueOnce({
      status: 400,
      reason: 'GROK_OAUTH_INVALID_STATE',
      message: 'invalid oauth state'
    })
    const oauth = useGrokOAuth()

    const tokenInfo = await oauth.exchangeAuthCode({
      code: 'code',
      sessionId: 'session-id',
      state: 'wrong-state'
    })

    expect(tokenInfo).toBeNull()
    expect(oauth.error.value).toBe(
      'Grok OAuth state 与当前会话不匹配。请粘贴同一次生成的授权链接返回的回调 URL。'
    )
  })
})

describe('useGrokOAuth.buildCredentials', () => {
  it('persists the Grok CLI subscription proxy for OAuth inference', () => {
    const oauth = useGrokOAuth()

    const credentials = oauth.buildCredentials({
      accessToken: 'access-token',
      tokenType: 'Bearer',
      expiresAt: 1_900_000_000,
      client_id: 'client-id',
      scope: 'openid grok-cli:access',
      email: 'grok@example.com'
    })

    expect(credentials.base_url).toBe('https://cli-chat-proxy.grok.com/v1')
  })
})
