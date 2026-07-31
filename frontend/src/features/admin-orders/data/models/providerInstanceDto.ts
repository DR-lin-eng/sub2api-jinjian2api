import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ProviderInstance } from '@/features/admin-orders/domain/models/providerInstance'

export class ProviderInstanceDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'provider_key' })
  @Transform(({ value }) => value ?? '')
  providerKey!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? {})
  config!: Record<string, string>

  @Expose({ name: 'supported_types' })
  @Transform(({ value }) => value ?? [])
  supportedTypes!: string[]

  @Expose()
  @Transform(({ value }) => value ?? false)
  enabled!: boolean

  @Expose({ name: 'payment_mode' })
  @Transform(({ value }) => value ?? '')
  paymentMode!: string

  @Expose({ name: 'refund_enabled' })
  @Transform(({ value }) => value ?? false)
  refundEnabled!: boolean

  @Expose({ name: 'allow_user_refund' })
  @Transform(({ value }) => value ?? false)
  allowUserRefund!: boolean

  @Expose()
  @Transform(({ value }) => value ?? '')
  limits!: string

  @Expose({ name: 'sort_order' })
  @Transform(({ value }) => value ?? 0)
  sortOrder!: number

  static fromJson(json: unknown): ProviderInstanceDto {
    return plainToInstance(ProviderInstanceDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ProviderInstance {
    const entity = new ProviderInstance()
    entity.id = this.id
    entity.providerKey = this.providerKey
    entity.name = this.name
    entity.config = this.config
    entity.supportedTypes = this.supportedTypes
    entity.enabled = this.enabled
    entity.paymentMode = this.paymentMode
    entity.refundEnabled = this.refundEnabled
    entity.allowUserRefund = this.allowUserRefund
    entity.limits = this.limits
    entity.sortOrder = this.sortOrder
    return entity
  }
}
