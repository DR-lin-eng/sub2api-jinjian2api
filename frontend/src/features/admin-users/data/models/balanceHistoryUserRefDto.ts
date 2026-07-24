import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BalanceHistoryUserRef } from '@/features/admin-users/domain/models/balanceHistoryUserRef'

export class BalanceHistoryUserRefDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  email!: string

  static fromJson(json: unknown): BalanceHistoryUserRefDto {
    return plainToInstance(BalanceHistoryUserRefDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BalanceHistoryUserRef {
    const entity = new BalanceHistoryUserRef()
    entity.id = this.id
    entity.email = this.email
    return entity
  }
}
