export interface UpdateBetaPolicyRequest {
  rules: Array<{
    beta_token: string
    action: 'pass' | 'filter' | 'block'
    scope: 'all' | 'oauth' | 'apikey' | 'bedrock'
    error_message?: string
    model_whitelist?: string[]
    fallback_action?: 'pass' | 'filter' | 'block'
    fallback_error_message?: string
  }>
}
