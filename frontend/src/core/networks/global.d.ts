import type { PublicSettings } from '@/core/models/domain/publicSettings'

declare global {
  interface Window {
    __APP_CONFIG__?: PublicSettings
  }
}

export {}
