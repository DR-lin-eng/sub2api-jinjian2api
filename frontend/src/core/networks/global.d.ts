import type { PublicSettings } from '@/features/auth/domain/models/publicSettings'

declare global {
  interface Window {
    __APP_CONFIG__?: PublicSettings
  }
}

export {}
