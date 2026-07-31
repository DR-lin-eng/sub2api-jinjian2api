import type { PromptAuditEvent } from './promptAuditEvent'

export class PromptEventPage {
  items!: PromptAuditEvent[]
  total!: number
  page!: number
  pageSize!: number
  pages!: number
}
