import type { UserAuthProvider } from './userAuthProvider'

export class UserAuthBindingStatus {
  bound!: boolean
  boundCount!: number
  provider!: UserAuthProvider | string
  providerKey!: string
  providerSubject!: string
  issuer!: string
  label!: string
  providerLabel!: string
  displayName!: string
  subjectHint!: string
  verifiedAt!: string
  bindStartPath!: string
  canBind!: boolean
  canUnbind!: boolean
  noteKey!: string
  note!: string
  metadata!: Record<string, unknown>
}
