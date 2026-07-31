export class GeminiTokenInfo {
  [key: string]: unknown
  accessToken!: string
  refreshToken!: string
  tokenType!: string
  scope!: string
  expiresIn!: number
  expiresAt!: number
  projectId!: string
  oauthType!: string
  tierId!: string
  extra!: Record<string, unknown>
}
