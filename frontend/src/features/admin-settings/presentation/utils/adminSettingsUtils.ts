import type { DefaultPlatformQuotasMap } from '@/features/admin-settings/domain/models/adminSettings'
import type { DefaultSubscriptionSetting } from '@/features/admin-settings/domain/models/defaultSubscriptionSetting'
import type { AuthSourceDefaultsState } from '@/features/admin-settings/domain/models/adminSettings'
import type { AuthSourceType } from '@/features/admin-settings/enums/authSourceType'
import type { UpdateSettingsRequest } from '@/features/admin-settings/data/requests_models/updateSettingsRequest'

const PLATFORMS: Array<keyof DefaultPlatformQuotasMap> = ['anthropic', 'openai', 'gemini', 'antigravity', 'grok']

export function normalizePlatformQuotasMap(input?: DefaultPlatformQuotasMap | null): DefaultPlatformQuotasMap {
  const result: DefaultPlatformQuotasMap = {}
  for (const p of PLATFORMS) {
    const src = input?.[p]
    result[p] = {
      daily: typeof src?.daily === 'number' ? src.daily : null,
      weekly: typeof src?.weekly === 'number' ? src.weekly : null,
      monthly: typeof src?.monthly === 'number' ? src.monthly : null,
    }
  }
  return result
}

export function sanitizePlatformQuotasMap(input?: DefaultPlatformQuotasMap | null): DefaultPlatformQuotasMap {
  const clean = (v: unknown): number | null =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null
  const result: DefaultPlatformQuotasMap = {}
  for (const p of PLATFORMS) {
    const src = input?.[p]
    result[p] = { daily: clean(src?.daily), weekly: clean(src?.weekly), monthly: clean(src?.monthly) }
  }
  return result
}

export function normalizeDefaultSubscriptionSettings(
  subscriptions: Array<{ group_id: number; validity_days: number }> | null | undefined,
): DefaultSubscriptionSetting[] {
  if (!Array.isArray(subscriptions)) return []
  return subscriptions
    .filter(item => item.group_id > 0 && item.validity_days > 0)
    .map(item => {
      const e = new (require('@/features/admin-settings/domain/models/defaultSubscriptionSetting').DefaultSubscriptionSetting)()
      e.groupId = Math.floor(item.group_id)
      e.validityDays = Math.min(36500, Math.max(1, Math.floor(item.validity_days)))
      return e
    })
}

const AUTH_SOURCE_TYPES: AuthSourceType[] = ['email', 'linuxdo', 'oidc', 'wechat', 'github', 'google', 'dingtalk']

export function buildAuthSourceDefaultsState(settings: Record<string, unknown>): AuthSourceDefaultsState {
  return AUTH_SOURCE_TYPES.reduce((acc, source) => {
    const subs = settings[`auth_source_default_${source}_subscriptions`]
    acc[source] = {
      balance: Number(settings[`auth_source_default_${source}_balance`] ?? 0),
      concurrency: Math.max(1, Number(settings[`auth_source_default_${source}_concurrency`] ?? 5)),
      subscriptions: normalizeDefaultSubscriptionSettings(
        Array.isArray(subs) ? (subs as Array<{ group_id: number; validity_days: number }>) : []
      ),
      grantOnSignup: settings[`auth_source_default_${source}_grant_on_signup`] === true,
      grantOnFirstBind: settings[`auth_source_default_${source}_grant_on_first_bind`] === true,
      platformQuotas: normalizePlatformQuotasMap(settings[`auth_source_default_${source}_platform_quotas`] as DefaultPlatformQuotasMap | undefined),
    }
    return acc
  }, {} as AuthSourceDefaultsState)
}

export function appendAuthSourceDefaultsToUpdateRequest(
  payload: UpdateSettingsRequest,
  authSourceDefaults: AuthSourceDefaultsState,
): UpdateSettingsRequest {
  const target = payload as Record<string, unknown>
  for (const source of AUTH_SOURCE_TYPES) {
    const current = authSourceDefaults[source]
    target[`auth_source_default_${source}_balance`] = Number(current.balance) || 0
    target[`auth_source_default_${source}_concurrency`] = Math.max(1, Math.floor(Number(current.concurrency) || 5))
    target[`auth_source_default_${source}_subscriptions`] = current.subscriptions.map(s => ({
      group_id: s.groupId,
      validity_days: s.validityDays,
    }))
    target[`auth_source_default_${source}_grant_on_signup`] = current.grantOnSignup
    target[`auth_source_default_${source}_grant_on_first_bind`] = current.grantOnFirstBind
    target[`auth_source_default_${source}_platform_quotas`] = sanitizePlatformQuotasMap(current.platformQuotas)
  }
  return payload
}

export type PaymentVisibleMethod = 'alipay' | 'wxpay'
export type PaymentVisibleMethodSource = '' | 'official_alipay' | 'easypay_alipay' | 'official_wxpay' | 'easypay_wxpay'
export type WeChatConnectMode = 'open' | 'mp' | 'mobile'

const PAYMENT_VISIBLE_METHOD_SOURCE_OPTIONS: Record<PaymentVisibleMethod, Array<{ value: PaymentVisibleMethodSource; labelZh: string; labelEn: string }>> = {
  alipay: [
    { value: '', labelZh: '未配置', labelEn: 'Not configured' },
    { value: 'official_alipay', labelZh: '支付宝官方', labelEn: 'Official Alipay' },
    { value: 'easypay_alipay', labelZh: '易支付支付宝', labelEn: 'EasyPay Alipay' },
  ],
  wxpay: [
    { value: '', labelZh: '未配置', labelEn: 'Not configured' },
    { value: 'official_wxpay', labelZh: '微信官方', labelEn: 'Official WeChat Pay' },
    { value: 'easypay_wxpay', labelZh: '易支付微信', labelEn: 'EasyPay WeChat Pay' },
  ],
}

export function getPaymentVisibleMethodSourceOptions(method: PaymentVisibleMethod) {
  return PAYMENT_VISIBLE_METHOD_SOURCE_OPTIONS[method]
}

const PAYMENT_VISIBLE_METHOD_SOURCE_ALIASES: Record<PaymentVisibleMethod, Record<string, PaymentVisibleMethodSource>> = {
  alipay: { official_alipay: 'official_alipay', alipay: 'official_alipay', alipay_direct: 'official_alipay', official: 'official_alipay', easypay_alipay: 'easypay_alipay', easypay: 'easypay_alipay' },
  wxpay: { official_wxpay: 'official_wxpay', wxpay: 'official_wxpay', wxpay_direct: 'official_wxpay', wechat: 'official_wxpay', official: 'official_wxpay', easypay_wxpay: 'easypay_wxpay', easypay: 'easypay_wxpay' },
}

export function normalizePaymentVisibleMethodSource(
  method: PaymentVisibleMethod,
  source: unknown,
): PaymentVisibleMethodSource {
  if (typeof source !== 'string') return ''
  const normalized = source.trim().toLowerCase()
  if (!normalized) return ''
  return PAYMENT_VISIBLE_METHOD_SOURCE_ALIASES[method][normalized] ?? ''
}

const WECHAT_CONNECT_MODE_ALIASES: Record<string, WeChatConnectMode> = {
  open: 'open', open_platform: 'open', official: 'open', wx_open: 'open',
  mp: 'mp', official_account: 'mp', wechat_mp: 'mp', mini_program: 'mp',
  mobile: 'mobile', mobile_app: 'mobile', native_app: 'mobile',
}

export function normalizeWeChatConnectMode(source: unknown): WeChatConnectMode {
  if (typeof source !== 'string') return 'open'
  const normalized = source.trim().toLowerCase()
  if (!normalized) return 'open'
  return WECHAT_CONNECT_MODE_ALIASES[normalized] ?? 'open'
}

export function defaultWeChatConnectScopesForMode(mode: unknown): string {
  switch (normalizeWeChatConnectMode(mode)) {
    case 'mp': return 'snsapi_userinfo'
    case 'mobile': return ''
    default: return 'snsapi_login'
  }
}

export function resolveWeChatConnectModeCapabilities(
  openEnabled: unknown,
  mpEnabled: unknown,
  mobileEnabled: unknown,
  legacyMode: unknown,
): { openEnabled: boolean; mpEnabled: boolean; mobileEnabled: boolean } {
  if (typeof openEnabled === 'boolean' || typeof mpEnabled === 'boolean' || typeof mobileEnabled === 'boolean') {
    return { openEnabled: openEnabled === true, mpEnabled: mpEnabled === true, mobileEnabled: mobileEnabled === true }
  }
  switch (normalizeWeChatConnectMode(legacyMode)) {
    case 'mp': return { openEnabled: false, mpEnabled: true, mobileEnabled: false }
    case 'mobile': return { openEnabled: false, mpEnabled: false, mobileEnabled: true }
    default: return { openEnabled: true, mpEnabled: false, mobileEnabled: false }
  }
}

export function deriveWeChatConnectStoredMode(
  openEnabled: boolean, mpEnabled: boolean, mobileEnabled: boolean, legacyMode: unknown,
): WeChatConnectMode {
  if (mpEnabled) return 'mp'
  if (mobileEnabled) return 'mobile'
  if (openEnabled) return 'open'
  return normalizeWeChatConnectMode(legacyMode)
}
