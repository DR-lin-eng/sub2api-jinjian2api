import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { CustomMenuItem } from '@/features/auth/domain/models/customMenuItem'

export class CustomMenuItemDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  id!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  label!: string

  @Expose({ name: 'icon_svg' })
  @Transform(({ value }) => value ?? '')
  iconSvg!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  url!: string

  @Expose({ name: 'page_slug' })
  pageSlug?: string

  @Expose()
  @Transform(({ value }) => value ?? 'user')
  visibility!: 'user' | 'admin'

  @Expose({ name: 'sort_order' })
  @Transform(({ value }) => value ?? 0)
  sortOrder!: number

  static fromJson(json: unknown): CustomMenuItemDto {
    return plainToInstance(CustomMenuItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CustomMenuItem {
    const e = new CustomMenuItem()
    e.id = this.id
    e.label = this.label
    e.iconSvg = this.iconSvg
    e.url = this.url
    e.pageSlug = this.pageSlug
    e.visibility = this.visibility
    e.sortOrder = this.sortOrder
    return e
  }
}
