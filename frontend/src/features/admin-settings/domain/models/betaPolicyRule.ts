export class BetaPolicyRule {
  betaToken!: string
  action!: 'pass' | 'filter' | 'block'
  scope!: 'all' | 'oauth' | 'apikey' | 'bedrock'
  errorMessage?: string
  modelWhitelist?: string[]
  fallbackAction?: 'pass' | 'filter' | 'block'
  fallbackErrorMessage?: string
}
