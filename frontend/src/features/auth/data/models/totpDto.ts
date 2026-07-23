/* DTO — mirrors backend JSON contract (snake_case). Per spec §5.3. */
export type {
  TotpStatus,
  TotpSetupRequest,
  TotpSetupResponse,
  TotpEnableRequest,
  TotpEnableResponse,
  TotpDisableRequest,
  TotpVerificationMethod,
  TotpLoginResponse,
  TotpLogin2FARequest,
} from '@/types'
