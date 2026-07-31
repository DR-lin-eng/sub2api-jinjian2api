import type { PublicSettings } from '@/core/models/domain/publicSettings'

export type ExternalHumanVerificationProvider = 'turnstile' | 'recaptcha' | 'cap'
export type HumanVerificationProvider = 'none' | 'local' | ExternalHumanVerificationProvider

export interface HumanVerificationConfig {
  provider: HumanVerificationProvider
  externalProvider: ExternalHumanVerificationProvider
  external: boolean
  siteKey: string
  apiEndpoint: string
}

export function resolveHumanVerification(settings: PublicSettings): HumanVerificationConfig {
  if (settings.turnstileEnabled) {
    return {
      provider: 'turnstile',
      externalProvider: 'turnstile',
      external: true,
      siteKey: settings.turnstileSiteKey || '',
      apiEndpoint: ''
    }
  }
  if (settings.recaptchaEnabled) {
    return {
      provider: 'recaptcha',
      externalProvider: 'recaptcha',
      external: true,
      siteKey: settings.recaptchaSiteKey || '',
      apiEndpoint: ''
    }
  }
  if (settings.capEnabled) {
    return {
      provider: 'cap',
      externalProvider: 'cap',
      external: true,
      siteKey: '',
      apiEndpoint: settings.capApiEndpoint || ''
    }
  }
  if (settings.localCaptchaEnabled) {
    return { provider: 'local', externalProvider: 'turnstile', external: false, siteKey: '', apiEndpoint: '' }
  }
  return { provider: 'none', externalProvider: 'turnstile', external: false, siteKey: '', apiEndpoint: '' }
}
