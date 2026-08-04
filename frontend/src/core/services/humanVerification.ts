import type { PublicSettings } from '@/types'

export type ExternalHumanVerificationProvider = 'turnstile' | 'recaptcha' | 'cap' | 'tencent'
export type HumanVerificationProvider = 'none' | 'local' | ExternalHumanVerificationProvider

export interface HumanVerificationConfig {
  provider: HumanVerificationProvider
  externalProvider: ExternalHumanVerificationProvider
  external: boolean
  siteKey: string
  apiEndpoint: string
}

export function resolveHumanVerification(settings: PublicSettings): HumanVerificationConfig {
  if (settings.turnstile_enabled) {
    return {
      provider: 'turnstile',
      externalProvider: 'turnstile',
      external: true,
      siteKey: settings.turnstile_site_key || '',
      apiEndpoint: ''
    }
  }
  if (settings.recaptcha_enabled) {
    return {
      provider: 'recaptcha',
      externalProvider: 'recaptcha',
      external: true,
      siteKey: settings.recaptcha_site_key || '',
      apiEndpoint: ''
    }
  }
  if (settings.cap_enabled) {
    return {
      provider: 'cap',
      externalProvider: 'cap',
      external: true,
      siteKey: '',
      apiEndpoint: settings.cap_api_endpoint || ''
    }
  }
  if (settings.tencent_captcha_enabled) {
    return {
      provider: 'tencent',
      externalProvider: 'tencent',
      external: true,
      siteKey: settings.tencent_captcha_app_id || '',
      apiEndpoint: ''
    }
  }
  if (settings.local_captcha_enabled) {
    return { provider: 'local', externalProvider: 'turnstile', external: false, siteKey: '', apiEndpoint: '' }
  }
  return { provider: 'none', externalProvider: 'turnstile', external: false, siteKey: '', apiEndpoint: '' }
}

export interface TencentCaptchaProof {
  ticket: string
  randstr: string
}

export interface TencentCaptchaResult {
  ret: number
  ticket?: string | null
  randstr?: string | null
  errorCode?: number
  errorMessage?: string
}

export interface TencentCaptchaInstance {
  show(): void
  destroy(): void
}

export type TencentCaptchaConstructor = new (
  appId: string,
  callback: (result: TencentCaptchaResult) => void,
  options?: Record<string, unknown>
) => TencentCaptchaInstance

declare global {
  interface Window {
    TencentCaptcha?: TencentCaptchaConstructor
  }
}

const tencentCaptchaScriptSrc = 'https://turing.captcha.qcloud.com/TJCaptcha.js'
let tencentCaptchaLoadPromise: Promise<TencentCaptchaConstructor> | null = null

export function loadTencentCaptcha(): Promise<TencentCaptchaConstructor> {
  if (window.TencentCaptcha) return Promise.resolve(window.TencentCaptcha)
  if (tencentCaptchaLoadPromise) return tencentCaptchaLoadPromise

  tencentCaptchaLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = tencentCaptchaScriptSrc
    script.async = true
    const fail = (message: string): void => {
      script.remove()
      tencentCaptchaLoadPromise = null
      reject(new Error(message))
    }
    script.onload = () => {
      if (window.TencentCaptcha) {
        resolve(window.TencentCaptcha)
        return
      }
      fail('Tencent Captcha SDK is unavailable')
    }
    script.onerror = () => fail('Failed to load Tencent Captcha SDK')
    document.head.appendChild(script)
  })

  return tencentCaptchaLoadPromise
}

export function resetTencentCaptchaLoaderForTest(): void {
  tencentCaptchaLoadPromise = null
}
