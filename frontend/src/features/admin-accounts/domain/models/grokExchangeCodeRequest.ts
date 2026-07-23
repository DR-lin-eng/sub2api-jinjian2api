export interface GrokExchangeCodeRequest {
  sessionId: string
  state: string
  code: string
  proxyId?: number
  redirectUri?: string
}
