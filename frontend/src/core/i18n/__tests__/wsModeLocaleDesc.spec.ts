import { describe, expect, it } from 'vitest'

import en from '../locales/en/admin/accounts'
import zh from '../locales/zh/admin/accounts'

describe('OpenAI WS mode locale descriptions', () => {
  it('documents the global v2 router requirement for account WS modes', () => {
    expect(zh.accounts.openai.wsModeDesc).toContain('mode_router_v2_enabled')
    expect(zh.accounts.openai.wsModeDesc).toContain('http_bridge')
    expect(en.accounts.openai.wsModeDesc).toContain('mode_router_v2_enabled')
    expect(en.accounts.openai.wsModeDesc).toContain('http_bridge')
  })

  it('keeps the Codex account prewarm label concise', () => {
    expect(zh.accounts.openai.codexPrewarmContinuation).toBe('Codex 账号预热')
    expect(en.accounts.openai.codexPrewarmContinuation).toBe('Codex account prewarm')
    expect('codexPrewarmContinuationDesc' in zh.accounts.openai).toBe(false)
    expect('codexPrewarmContinuationDesc' in en.accounts.openai).toBe(false)
  })
})
