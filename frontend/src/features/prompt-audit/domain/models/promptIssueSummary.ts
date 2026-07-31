export class PromptIssueSummary {
  category!: string
  scannerId!: string
  title!: string
  description!: string
  severity!: string
  severityLabel!: string
  action!: string
  actionLabel!: string
  code!: string
  score!: number
  evidence!: string
  evidenceHash!: string
  startRune?: number
  endRune?: number
}
