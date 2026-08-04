import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  loadTencentCaptcha,
  resetTencentCaptchaLoaderForTest,
  resolveHumanVerification,
  type TencentCaptchaConstructor
} from '@/core/services/humanVerification'
import type { PublicSettings } from '@/types'

function settings(overrides: Partial<PublicSettings>): PublicSettings {
  return {
    turnstile_enabled: false,
    turnstile_site_key: '',
    recaptcha_enabled: false,
    recaptcha_site_key: '',
    cap_enabled: false,
    cap_api_endpoint: '',
    local_captcha_enabled: false,
    ...overrides
  } as PublicSettings
}

describe('resolveHumanVerification', () => {
  it.each([
    [settings({ turnstile_enabled: true, turnstile_site_key: 'cf-site' }), 'turnstile', 'cf-site', ''],
    [settings({ recaptcha_enabled: true, recaptcha_site_key: 'google-site' }), 'recaptcha', 'google-site', ''],
    [settings({ cap_enabled: true, cap_api_endpoint: 'https://cap.example/site' }), 'cap', '', 'https://cap.example/site'],
    [settings({ tencent_captcha_enabled: true, tencent_captcha_app_id: '123456789' }), 'tencent', '123456789', ''],
    [settings({ local_captcha_enabled: true }), 'local', '', '']
  ])('selects the configured provider', (publicSettings, provider, siteKey, apiEndpoint) => {
    expect(resolveHumanVerification(publicSettings)).toMatchObject({
      provider,
      siteKey,
      apiEndpoint
    })
  })

  it('keeps legacy Turnstile priority over the old local fallback combination', () => {
    expect(resolveHumanVerification(settings({
      turnstile_enabled: true,
      turnstile_site_key: 'cf-site',
      local_captcha_enabled: true
    })).provider).toBe('turnstile')
  })
})

describe('loadTencentCaptcha', () => {
  const scriptSelector = 'script[src="https://turing.captcha.qcloud.com/TJCaptcha.js"]'

  beforeEach(() => {
    resetTencentCaptchaLoaderForTest()
    delete window.TencentCaptcha
    document.querySelectorAll(scriptSelector).forEach(element => element.remove())
  })

  afterEach(() => {
    resetTencentCaptchaLoaderForTest()
    delete window.TencentCaptcha
    document.querySelectorAll(scriptSelector).forEach(element => element.remove())
  })

  it('singleflights concurrent SDK loads', async () => {
    const first = loadTencentCaptcha()
    const second = loadTencentCaptcha()

    expect(first).toBe(second)
    expect(document.querySelectorAll(scriptSelector)).toHaveLength(1)

    class TencentCaptchaMock {
      show() {}
      destroy() {}
    }
    window.TencentCaptcha = TencentCaptchaMock as unknown as TencentCaptchaConstructor
    document.querySelector<HTMLScriptElement>(scriptSelector)?.dispatchEvent(new Event('load'))

    await expect(first).resolves.toBe(window.TencentCaptcha)
    await expect(second).resolves.toBe(window.TencentCaptcha)
  })

  it('allows retry after a script load failure', async () => {
    const first = loadTencentCaptcha()
    document.querySelector<HTMLScriptElement>(scriptSelector)?.dispatchEvent(new Event('error'))
    await expect(first).rejects.toThrow('Failed to load Tencent Captcha SDK')

    const second = loadTencentCaptcha()
    expect(second).not.toBe(first)
    expect(document.querySelectorAll(scriptSelector)).toHaveLength(1)
  })
})
