export type ThinkingDisplayMode = 'off' | 'display_only' | 'force'

export class StreamTimeoutSettings {
  enabled!: boolean
  action!: 'temp_unsched' | 'error' | 'none'
  tempUnschedMinutes!: number
  thresholdCount!: number
  thresholdWindowMinutes!: number
}
