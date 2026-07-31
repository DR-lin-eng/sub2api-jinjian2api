import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ListS3ProfilesResponse } from '@/features/admin-backup/domain/models/listS3ProfilesResponse'
import { DataManagementS3ProfileDto } from '@/features/admin-backup/data/models/dataManagementS3ProfileDto'

export class ListS3ProfilesResponseDto {
  @Expose() @Type(() => DataManagementS3ProfileDto) @Transform(({ value }) => value ?? []) items!: DataManagementS3ProfileDto[]

  static fromJson(json: unknown): ListS3ProfilesResponseDto {
    return plainToInstance(ListS3ProfilesResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ListS3ProfilesResponse {
    const e = new ListS3ProfilesResponse()
    e.items = this.items.map(i => i.toEntity())
    return e
  }
}
