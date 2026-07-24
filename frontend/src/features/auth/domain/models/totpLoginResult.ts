export class TotpLoginResult {
  requires2fa!: boolean
  tempToken!: string
  userEmailMasked!: string
}
