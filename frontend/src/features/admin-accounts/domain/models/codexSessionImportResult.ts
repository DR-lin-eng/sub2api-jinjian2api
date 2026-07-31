import { CodexSessionImportItem } from '@/features/admin-accounts/domain/models/codexSessionImportItem'
import { CodexSessionImportWarning } from '@/features/admin-accounts/domain/models/codexSessionImportWarning'
import { CodexSessionImportError } from '@/features/admin-accounts/domain/models/codexSessionImportError'

export class CodexSessionImportResult {
  total!: number
  created!: number
  updated!: number
  skipped!: number
  failed!: number
  items!: CodexSessionImportItem[]
  warnings!: CodexSessionImportWarning[]
  errors!: CodexSessionImportError[]
}
