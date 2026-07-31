import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { SimpleUser } from '@/features/admin-usage/domain/models/simpleUser'

export class SimpleUserDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') email!: string
  @Expose() @Transform(({ value }) => value ?? false) deleted!: boolean

  static fromJson(json: unknown): SimpleUserDto {
    return plainToInstance(SimpleUserDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SimpleUser {
    const e = new SimpleUser()
    e.id = this.id
    e.email = this.email
    e.deleted = this.deleted
    return e
  }
}
