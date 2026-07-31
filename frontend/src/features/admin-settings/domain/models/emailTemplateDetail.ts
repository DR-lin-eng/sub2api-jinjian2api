export class EmailTemplateDetail {
  event!: string
  locale!: string
  subject!: string
  html!: string
  isCustom?: boolean
  updatedAt?: string
  placeholders?: string[]
}
