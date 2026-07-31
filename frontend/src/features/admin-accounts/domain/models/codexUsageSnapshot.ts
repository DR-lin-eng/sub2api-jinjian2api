export type CodexUsageSnapshot = {
  codexPrimaryUsedPercent?: number
  codexPrimaryResetAfterSeconds?: number
  codexPrimaryWindowMinutes?: number
  codexSecondaryUsedPercent?: number
  codexSecondaryResetAfterSeconds?: number
  codexSecondaryWindowMinutes?: number
  codexPrimaryOverSecondaryPercent?: number
  codex5hUsedPercent?: number
  codex5hResetAfterSeconds?: number
  codex5hResetAt?: string
  codex5hWindowMinutes?: number
  codex7dUsedPercent?: number
  codex7dResetAfterSeconds?: number
  codex7dResetAt?: string
  codex7dWindowMinutes?: number
  codexUsageUpdatedAt?: string
}
