export class OpenAIFastPolicyRule {
  serviceTier!: 'all' | 'priority' | 'flex'
  action!: 'pass' | 'filter' | 'block' | 'force_priority'
  scope!: 'all' | 'oauth' | 'apikey' | 'bedrock'
  userIds?: number[]
  errorMessage?: string
  modelWhitelist?: string[]
  fallbackAction?: 'pass' | 'filter' | 'block' | 'force_priority'
  fallbackErrorMessage?: string
}
