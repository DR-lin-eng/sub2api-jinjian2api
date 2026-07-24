import type { CreateOrderResultType } from './createOrderResultType'
import type { WechatOAuthInfo } from './wechatOAuthInfo'
import type { WechatJSAPIPayload } from './wechatJSAPIPayload'

export class CreateOrderResult {
  orderId!: number
  amount!: number
  payAmount!: number
  feeRate!: number
  expiresAt!: string
  payUrl?: string
  qrCode?: string
  clientSecret?: string
  intentId?: string
  currency?: string
  countryCode?: string
  paymentEnv?: string
  resultType?: CreateOrderResultType
  paymentType?: string
  outTradeNo?: string
  paymentMode?: string
  resumeToken?: string
  oauth?: WechatOAuthInfo
  jsapi?: WechatJSAPIPayload
  jsapiPayload?: WechatJSAPIPayload
}
