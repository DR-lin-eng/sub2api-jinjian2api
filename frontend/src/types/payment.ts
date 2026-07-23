/**
 * Payment System Type Definitions
 */

// ==================== Enums / Union Types ====================

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'RECHARGING'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUND_REQUESTED'
  | 'REFUNDING'
  | 'REFUND_PENDING'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'REFUND_FAILED'

export type PaymentType = 'alipay' | 'wxpay' | 'alipay_direct' | 'wxpay_direct' | 'stripe' | 'easypay' | 'airwallex'

export type OrderType = 'balance' | 'subscription'

// ==================== Configuration ====================

export interface PaymentConfig {
  paymentEnabled: boolean
  minAmount: number
  maxAmount: number
  dailyLimit: number
  maxPendingOrders: number
  orderTimeoutMinutes: number
  balanceDisabled: boolean
  balanceRechargeMultiplier: number
  subscriptionUsdToCnyRate: number
  enabledPaymentTypes: PaymentType[]
  helpImageUrl: string
  helpText: string
  stripePublishableKey: string
}

export interface MethodLimit {
  currency?: string
  displayName?: string
  dailyLimit: number
  dailyUsed: number
  dailyRemaining: number
  singleMin: number
  singleMax: number
  feeRate: number
  available: boolean
}

/** Response from /payment/limits API */
export interface MethodLimitsResponse {
  methods: Record<string, MethodLimit>
  globalMin: number  // widest min across all methods; 0 = no minimum
  globalMax: number  // widest max across all methods; 0 = no maximum
}

/** Response from /payment/checkout-info API — single call for the payment page */
export interface CheckoutInfoResponse {
  methods: Record<string, MethodLimit>
  globalMin: number
  globalMax: number
  plans: SubscriptionPlan[]
  balanceDisabled: boolean
  balanceRechargeMultiplier: number
  /** Subscription CNY conversion rate (1 USD = X CNY); 0 = disabled, plan price is charged as-is */
  subscriptionUsdToCnyRate: number
  rechargeFeeRate: number
  helpText: string
  helpImageUrl: string
  stripePublishableKey: string
  /** When true, Alipay payments on mobile always show the QR code instead of redirecting */
  alipayForceQrcode?: boolean
}

// ==================== Orders ====================

export interface PaymentOrder {
  id: number
  userId: number
  amount: number
  payAmount: number
  currency?: string
  feeRate: number
  paymentType: string
  outTradeNo: string
  status: OrderStatus
  orderType: OrderType
  createdAt: string
  expiresAt: string
  paidAt?: string
  completedAt?: string
  refundAmount: number
  refundReason?: string
  refundRequestedAt?: string
  refundRequestedBy?: number
  refundRequestReason?: string
  planId?: number
  providerInstanceId?: string
}

// ==================== Plans & Channels ====================

export interface SubscriptionPlan {
  id: number
  groupId: number
  groupPlatform?: string
  groupName?: string
  rateMultiplier?: number
  peakRateEnabled?: boolean
  peakStart?: string
  peakEnd?: string
  peakRateMultiplier?: number
  dailyLimitUsd?: number | null
  weeklyLimitUsd?: number | null
  monthlyLimitUsd?: number | null
  supportedModelScopes?: string[]
  name: string
  description: string
  price: number
  originalPrice?: number
  /** Display-only ISO 4217 currency label (e.g. "NZD"); empty means no label */
  currency?: string
  validityDays: number
  validityUnit: string
  /** Stored as JSON string in backend; API layer should parse before use */
  features: string[]
  forSale: boolean
  sortOrder: number
}

export interface PaymentChannel {
  id: number
  groupId?: number
  name: string
  platform: string
  rateMultiplier: number
  description: string
  models: string[]
  features: string[]
  enabled: boolean
}

// ==================== Providers ====================

export interface ProviderInstance {
  id: number
  providerKey: string
  name: string
  config: Record<string, string>
  supportedTypes: string[]
  enabled: boolean
  paymentMode: string
  refundEnabled: boolean
  allowUserRefund: boolean
  limits: string
  sortOrder: number
}

// ==================== Request / Response ====================

export interface CreateOrderRequest {
  amount: number
  paymentType: string
  orderType: string
  planId?: number
  returnUrl?: string
  paymentSource?: string
  openid?: string
  wechatResumeToken?: string
  isMobile?: boolean
}

export type CreateOrderResultType = 'order_created' | 'oauth_required' | 'jsapi_ready'

export interface WechatOAuthInfo {
  authorizeUrl?: string
  appid?: string
  openid?: string
  scope?: string
  state?: string
  redirectUrl?: string
}

export interface WechatJSAPIPayload {
  appId?: string
  timeStamp?: string
  nonceStr?: string
  package?: string
  signType?: string
  paySign?: string
}

export interface CreateOrderResult {
  orderId: number
  amount: number
  payUrl?: string
  qrCode?: string
  clientSecret?: string
  intentId?: string
  currency?: string
  countryCode?: string
  paymentEnv?: string
  payAmount: number
  feeRate: number
  expiresAt: string
  resultType?: CreateOrderResultType
  paymentType?: string
  outTradeNo?: string
  paymentMode?: string
  resumeToken?: string
  oauth?: WechatOAuthInfo
  jsapi?: WechatJSAPIPayload
  jsapiPayload?: WechatJSAPIPayload
}

export interface DashboardStats {
  todayAmount: number
  totalAmount: number
  todayCount: number
  totalCount: number
  avgAmount: number
  dailySeries: { date: string; amount: number; count: number }[]
  paymentMethods: { type: string; amount: number; count: number }[]
  topUsers: { user_id: number; email: string; amount: number }[]
}
