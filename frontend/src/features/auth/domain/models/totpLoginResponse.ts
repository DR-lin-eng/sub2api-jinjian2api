export class TotpLoginResponse {
  requires2fa!: boolean
  tempToken?: string
  userEmailMasked?: string
}
