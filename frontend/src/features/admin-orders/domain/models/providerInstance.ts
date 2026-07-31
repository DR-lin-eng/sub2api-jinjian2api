export class ProviderInstance {
  id!: number
  providerKey!: string
  name!: string
  config!: Record<string, string>
  supportedTypes!: string[]
  enabled!: boolean
  paymentMode!: string
  refundEnabled!: boolean
  allowUserRefund!: boolean
  limits!: string
  sortOrder!: number
}
