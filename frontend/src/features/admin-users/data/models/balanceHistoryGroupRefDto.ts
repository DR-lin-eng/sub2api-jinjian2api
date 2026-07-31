import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BalanceHistoryGroupRef } from '@/features/admin-users/domain/models/balanceHistoryGroupRef'

export class BalanceHistoryGroupRefDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  static fromJson(json: unknown): BalanceHistoryGroupRefDto {
    return plainToInstance(BalanceHistoryGroupRefDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BalanceHistoryGroupRef {
    const entity = new BalanceHistoryGroupRef()
    entity.id = this.id
    entity.name = this.name
    return entity
  }
}
