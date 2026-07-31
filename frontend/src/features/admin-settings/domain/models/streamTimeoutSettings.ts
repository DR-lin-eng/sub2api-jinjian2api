import type { ThinkingDisplayMode } from '@/features/admin-settings/enums/thinkingDisplayMode'

export { ThinkingDisplayMode }

export class StreamTimeoutSettings {
  enabled!: boolean
  action!: 'temp_unsched' | 'error' | 'none'
  tempUnschedMinutes!: number
  thresholdCount!: number
  thresholdWindowMinutes!: number
}
