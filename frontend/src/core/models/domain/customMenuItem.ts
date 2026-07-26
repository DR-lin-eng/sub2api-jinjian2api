export class CustomMenuItem {
  id!: string
  label!: string
  iconSvg!: string
  url!: string
  sortOrder!: number
  pageSlug?: string
  visibility!: 'user' | 'admin'
}
