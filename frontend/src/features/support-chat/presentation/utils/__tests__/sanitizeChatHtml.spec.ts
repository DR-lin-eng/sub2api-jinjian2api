import { describe, expect, it } from 'vitest'
import { sanitizeChatHtml } from '@/features/support-chat/presentation/utils/sanitizeChatHtml'

describe('sanitizeChatHtml', () => {
  it('removes executable markup and event handlers', () => {
    const result = sanitizeChatHtml('<script>alert(1)</script><img src=x onerror=alert(1)>safe')

    expect(result).not.toContain('<script')
    expect(result).not.toContain('onerror')
    expect(result).toContain('safe')
  })

  it('rejects unsafe and protocol-relative links', () => {
    const result = sanitizeChatHtml(
      '<a href="javascript:alert(1)">bad</a><a href="//evil.example">bad host</a><a href="\\evil.example">bad slash</a><a href="/\\evil.example">bad mixed slash</a><a href="https://example.com/help">good</a>',
    )

    expect(result).not.toContain('javascript:')
    expect(result).not.toContain('//evil.example')
    expect(result).not.toContain('\\evil.example')
    expect(result).toContain('https://example.com/help')
  })

  it('removes browsing-context attributes from links', () => {
    const result = sanitizeChatHtml(
      '<a href="https://example.com/help" target="_blank" rel="opener">help</a>',
    )

    expect(result).toBe('<a href="https://example.com/help">help</a>')
  })

  it('removes presentation and data attributes while keeping supported content', () => {
    const result = sanitizeChatHtml(
      '<p class="attack" style="background:url(javascript:alert(1))" data-secret="x">Hello <strong>there</strong></p>',
    )

    expect(result).toContain('<p>Hello <strong>there</strong></p>')
    expect(result).not.toContain('class=')
    expect(result).not.toContain('style=')
    expect(result).not.toContain('data-secret')
  })
})
