export type EmailTemplateEventOption = string | EmailTemplateOption

export class EmailTemplateOption {
  value!: string
  label!: string
  description!: string
  category!: string
  optional!: boolean
}
