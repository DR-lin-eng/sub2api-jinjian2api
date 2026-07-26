import { describe, expect, it } from 'vitest'
import { resolveHumanVerification } from '@/core/services/humanVerification'
import type { PublicSettings } from '@/core/models/domain/publicSettings'

function settings(overrides: Partial<PublicSettings>): PublicSettings {
  return {
    turnstileEnabled: false,
    turnstileSiteKey: '',
    recaptchaEnabled: false,
    recaptchaSiteKey: '',
    capEnabled: false,
    capApiEndpoint: '',
    localCaptchaEnabled: false,
    ...overrides
  } as PublicSettings
}

describe('resolveHumanVerification', () => {
  it.each([
    [settings({ turnstileEnabled: true, turnstileSiteKey: 'cf-site' }), 'turnstile', 'cf-site', ''],
    [settings({ recaptchaEnabled: true, recaptchaSiteKey: 'google-site' }), 'recaptcha', 'google-site', ''],
    [settings({ capEnabled: true, capApiEndpoint: 'https://cap.example/site' }), 'cap', '', 'https://cap.example/site'],
    [settings({ localCaptchaEnabled: true }), 'local', '', '']
  ])('selects the configured provider', (publicSettings, provider, siteKey, apiEndpoint) => {
    expect(resolveHumanVerification(publicSettings)).toMatchObject({
      provider,
      siteKey,
      apiEndpoint
    })
  })

  it('keeps legacy Turnstile priority over the old local fallback combination', () => {
    expect(resolveHumanVerification(settings({
      turnstileEnabled: true,
      turnstileSiteKey: 'cf-site',
      localCaptchaEnabled: true
    })).provider).toBe('turnstile')
  })
})
