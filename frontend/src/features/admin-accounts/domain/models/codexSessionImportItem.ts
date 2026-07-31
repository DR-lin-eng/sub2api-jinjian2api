export class CodexSessionImportItem {
  index!: number
  name!: string
  action!: 'created' | 'updated' | 'skipped' | 'failed'
  accountId!: number
  message!: string
}
