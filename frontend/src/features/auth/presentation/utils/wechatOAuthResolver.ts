export type WeChatOAuthMode = 'open' | 'mp'
export type WeChatOAuthUnavailableReason =
  | 'not_configured'
  | 'capability_unknown'
  | 'external_browser_required'
  | 'wechat_browser_required'
  | 'native_app_required'

export interface ResolvedWeChatOAuthStart {
  mode: WeChatOAuthMode | null
  openEnabled: boolean
  mpEnabled: boolean
  mobileEnabled: boolean
  isWeChatBrowser: boolean
  unavailableReason: WeChatOAuthUnavailableReason | null
}

export type WeChatOAuthPublicSettings = {
  wechatOauthEnabled?: boolean
  wechatOauthOpenEnabled?: boolean
  wechatOauthMpEnabled?: boolean
  wechatOauthMobileEnabled?: boolean
}

export function isWeChatWebOAuthEnabled(s: WeChatOAuthPublicSettings | null | undefined): boolean {
  const legacy = s?.wechatOauthEnabled ?? false
  const hasExplicit =
    typeof s?.wechatOauthOpenEnabled === 'boolean' || typeof s?.wechatOauthMpEnabled === 'boolean'
  if (!hasExplicit) return legacy
  return s?.wechatOauthOpenEnabled === true || s?.wechatOauthMpEnabled === true
}

export function hasExplicitWeChatOAuthCapabilities(
  s: WeChatOAuthPublicSettings | null | undefined,
): s is WeChatOAuthPublicSettings & { wechatOauthOpenEnabled: boolean; wechatOauthMpEnabled: boolean } {
  return (
    typeof s?.wechatOauthOpenEnabled === 'boolean' && typeof s?.wechatOauthMpEnabled === 'boolean'
  )
}

export function resolveWeChatOAuthStart(
  s: WeChatOAuthPublicSettings | null | undefined,
  userAgent?: string,
): ResolvedWeChatOAuthStart {
  const ua = (
    userAgent ??
    (typeof navigator !== 'undefined' ? navigator.userAgent : '') ??
    ''
  ).trim()
  const isWeChatBrowser = /MicroMessenger/i.test(ua)
  const legacy = s?.wechatOauthEnabled ?? false
  const openEnabled =
    typeof s?.wechatOauthOpenEnabled === 'boolean' ? s.wechatOauthOpenEnabled : legacy
  const mpEnabled =
    typeof s?.wechatOauthMpEnabled === 'boolean' ? s.wechatOauthMpEnabled : legacy
  const mobileEnabled =
    typeof s?.wechatOauthMobileEnabled === 'boolean' ? s.wechatOauthMobileEnabled : false

  if (isWeChatBrowser) {
    if (mpEnabled)
      return { mode: 'mp', openEnabled, mpEnabled, mobileEnabled, isWeChatBrowser, unavailableReason: null }
    if (openEnabled)
      return { mode: null, openEnabled, mpEnabled, mobileEnabled, isWeChatBrowser, unavailableReason: 'external_browser_required' }
    return { mode: null, openEnabled, mpEnabled, mobileEnabled, isWeChatBrowser, unavailableReason: 'not_configured' }
  }
  if (openEnabled)
    return { mode: 'open', openEnabled, mpEnabled, mobileEnabled, isWeChatBrowser, unavailableReason: null }
  if (mpEnabled)
    return { mode: null, openEnabled, mpEnabled, mobileEnabled, isWeChatBrowser, unavailableReason: 'wechat_browser_required' }
  return { mode: null, openEnabled, mpEnabled, mobileEnabled, isWeChatBrowser, unavailableReason: 'not_configured' }
}

export function resolveWeChatOAuthStartStrict(
  s: WeChatOAuthPublicSettings | null | undefined,
  userAgent?: string,
): ResolvedWeChatOAuthStart {
  const ua = (
    userAgent ??
    (typeof navigator !== 'undefined' ? navigator.userAgent : '') ??
    ''
  ).trim()
  const isWeChatBrowser = /MicroMessenger/i.test(ua)
  if (!hasExplicitWeChatOAuthCapabilities(s)) {
    return {
      mode: null, openEnabled: false, mpEnabled: false, mobileEnabled: false,
      isWeChatBrowser, unavailableReason: 'capability_unknown',
    }
  }
  return resolveWeChatOAuthStart(s, ua)
}
