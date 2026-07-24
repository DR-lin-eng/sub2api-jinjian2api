export class TotpSetupResponse {
  secret!: string
  qrCodeUrl!: string
  setupToken!: string
  countdown!: number
}
