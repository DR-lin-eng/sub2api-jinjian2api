import type { NotifyEmailEntry } from '@/core/models/domain/notifyEmailEntry'

export interface UpdateProfileRequest {
  username?: string
  avatar_url?: string | null
  balance_notify_enabled?: boolean
  balance_notify_threshold?: number | null
  balance_notify_extra_emails?: NotifyEmailEntry[]
}
