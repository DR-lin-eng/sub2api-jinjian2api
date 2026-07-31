import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TestS3Response } from '@/features/admin-backup/domain/models/testS3Response'

export class TestS3ResponseDto {
  @Expose() @Transform(({ value }) => value ?? false) ok!: boolean
  @Expose() @Transform(({ value }) => value ?? '') message!: string

  static fromJson(json: unknown): TestS3ResponseDto {
    return plainToInstance(TestS3ResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TestS3Response {
    const e = new TestS3Response()
    e.ok = this.ok
    e.message = this.message
    return e
  }
}
