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
