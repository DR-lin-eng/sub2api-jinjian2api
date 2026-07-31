export class GrokTokenInfo {
  [key: string]: unknown
  accessToken!: string
  refreshToken!: string
  tokenType!: string
  idToken!: string
  expiresAt!: number
  expiresIn!: number
  scope!: string
  clientId!: string
  email!: string
  sub!: string
  teamId!: string
  subscriptionTier!: string
  entitlementStatus!: string
}
