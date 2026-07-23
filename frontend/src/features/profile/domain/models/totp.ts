export interface TotpStatus {
  enabled: boolean
  enabledAt: number | null
  featureEnabled: boolean
}

export interface TotpSetupRequest {
  emailCode?: string
  password?: string
}

export interface TotpSetupResponse {
  secret: string
  qrCodeUrl: string
  setupToken: string
  countdown: number
}

export interface TotpEnableRequest {
  totpCode: string
  setupToken: string
}

export interface TotpEnableResponse {
  success: boolean
}

export interface TotpDisableRequest {
  emailCode?: string
  password?: string
}

export interface TotpVerificationMethod {
  method: 'email' | 'password'
}

export interface TotpLoginResponse {
  requires2fa: boolean
  tempToken?: string
  userEmailMasked?: string
}

export interface TotpLogin2FARequest {
  tempToken: string
  totpCode: string
}
