import { beforeEach, describe, expect, it, vi } from 'vitest'

const { post } = vi.hoisted(() => ({
  post: vi.fn()
}))

vi.mock('@/core/networks/client', () => ({
  apiClient: { post }
}))

import {
  authenticateAccountWithCookie,
  exchangeAccountAuthCode,
  exchangeCode,
  exchangeOpenAICode,
  generateAccountAuthUrl,
  generateAuthUrl,
  generateOpenAIAuthUrl,
  refreshOpenAIToken
} from '@/features/admin-accounts/data/datasources/adminAccountOAuthActions'
import accountsAPI, {
  exchangeCode as exchangeCodeFromFacade,
  generateAuthUrl as generateAuthUrlFromFacade,
  refreshOpenAIToken as refreshOpenAITokenFromFacade
} from '@/features/admin-accounts/data/datasources/adminAccountsDatasource'

describe('admin account OAuth actions', () => {
  beforeEach(() => {
    post.mockReset()
  })

  it('owns account OAuth endpoint selection and proxy payloads', async () => {
    post
      .mockResolvedValueOnce({ data: { auth_url: 'https://auth.example', session_id: 'session-1' } })
      .mockResolvedValueOnce({ data: { access_token: 'access-1' } })
      .mockResolvedValueOnce({ data: { access_token: 'access-2' } })

    await expect(generateAccountAuthUrl('setup-token', 7)).resolves.toEqual({
      auth_url: 'https://auth.example',
      session_id: 'session-1'
    })
    await expect(exchangeAccountAuthCode('oauth', {
      session_id: 'session-1',
      code: 'auth-code',
      proxy_id: 7
    })).resolves.toEqual({ access_token: 'access-1' })
    await expect(authenticateAccountWithCookie('setup-token', 'session-key', 7)).resolves.toEqual({
      access_token: 'access-2'
    })

    expect(post).toHaveBeenNthCalledWith(1, '/admin/accounts/generate-setup-token-url', {
      proxy_id: 7
    })
    expect(post).toHaveBeenNthCalledWith(2, '/admin/accounts/exchange-code', {
      session_id: 'session-1',
      code: 'auth-code',
      proxy_id: 7
    })
    expect(post).toHaveBeenNthCalledWith(3, '/admin/accounts/setup-token-cookie-auth', {
      session_id: '',
      code: 'session-key',
      proxy_id: 7
    })
  })

  it('preserves OpenAI redirect, state, proxy, and client payloads', async () => {
    post
      .mockResolvedValueOnce({ data: { auth_url: 'https://auth.openai.com?state=state-1', session_id: 'session-1' } })
      .mockResolvedValueOnce({ data: { access_token: 'access-token' } })
      .mockResolvedValueOnce({ data: { access_token: 'refreshed-token' } })

    await generateOpenAIAuthUrl({
      proxy_id: 9,
      redirect_uri: 'http://localhost:1455/auth/callback'
    })
    await exchangeOpenAICode({
      session_id: 'session-1',
      code: 'auth-code',
      state: 'state-1',
      proxy_id: 9
    })
    await refreshOpenAIToken('refresh-token', 9, undefined, 'app_client')

    expect(post).toHaveBeenNthCalledWith(1, '/admin/openai/generate-auth-url', {
      proxy_id: 9,
      redirect_uri: 'http://localhost:1455/auth/callback'
    })
    expect(post).toHaveBeenNthCalledWith(2, '/admin/openai/exchange-code', {
      session_id: 'session-1',
      code: 'auth-code',
      state: 'state-1',
      proxy_id: 9
    })
    expect(post).toHaveBeenNthCalledWith(3, '/admin/openai/refresh-token', {
      refresh_token: 'refresh-token',
      proxy_id: 9,
      client_id: 'app_client'
    })
  })

  it('keeps the transitional accounts facade on the same function identities', () => {
    expect(generateAuthUrlFromFacade).toBe(generateAuthUrl)
    expect(exchangeCodeFromFacade).toBe(exchangeCode)
    expect(refreshOpenAITokenFromFacade).toBe(refreshOpenAIToken)
    expect(accountsAPI.generateAuthUrl).toBe(generateAuthUrl)
    expect(accountsAPI.exchangeCode).toBe(exchangeCode)
    expect(accountsAPI.refreshOpenAIToken).toBe(refreshOpenAIToken)
  })
})
