export type OpsWSStatus = 'connecting' | 'connected' | 'reconnecting' | 'offline' | 'closed'

export interface SubscribeQPSOptions {
  token?: string
  wsBaseUrl?: string
  maxReconnectAttempts?: number
  reconnectBaseDelayMs?: number
  reconnectMaxDelayMs?: number
  staleTimeoutMs?: number
  staleCheckIntervalMs?: number
  onStatusChange?: (status: OpsWSStatus) => void
  onOpen?: () => void
  onClose?: (event: CloseEvent) => void
  onError?: (error: Event) => void
  onFatalClose?: (event: CloseEvent) => void
  onReconnectScheduled?: (info: { attempt: number; delayMs: number }) => void
}
