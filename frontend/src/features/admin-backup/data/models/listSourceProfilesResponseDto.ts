import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ListSourceProfilesResponse } from '@/features/admin-backup/domain/models/listSourceProfilesResponse'
import { DataManagementSourceProfileDto } from '@/features/admin-backup/data/models/dataManagementSourceProfileDto'

export class ListSourceProfilesResponseDto {
  @Expose() @Type(() => DataManagementSourceProfileDto) @Transform(({ value }) => value ?? []) items!: DataManagementSourceProfileDto[]

  static fromJson(json: unknown): ListSourceProfilesResponseDto {
    return plainToInstance(ListSourceProfilesResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ListSourceProfilesResponse {
    const e = new ListSourceProfilesResponse()
    e.items = this.items.map(i => i.toEntity())
    return e
  }
}
