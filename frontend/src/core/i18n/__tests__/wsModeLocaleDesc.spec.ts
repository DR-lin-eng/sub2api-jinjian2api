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

  it('documents that Codex prewarm 429s lower weight without hard-blocking the account', () => {
    expect(zh.accounts.openai.codexPrewarmContinuationDesc).toContain('降低调度权重')
    expect(zh.accounts.openai.codexPrewarmContinuationDesc).toContain('不会把账号硬屏蔽')
    expect(en.accounts.openai.codexPrewarmContinuationDesc).toContain('reduce scheduling weight')
    expect(en.accounts.openai.codexPrewarmContinuationDesc).toContain('never hard-block')
  })
})
