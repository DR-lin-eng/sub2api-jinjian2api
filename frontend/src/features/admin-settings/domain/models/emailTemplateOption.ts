export interface EmailTemplateOption {
  value: string
  label?: string
  description?: string
  category?: string
  optional?: boolean
}

export type EmailTemplateEventOption = string | EmailTemplateOption
