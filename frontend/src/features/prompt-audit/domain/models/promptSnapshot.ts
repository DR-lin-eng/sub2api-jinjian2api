export class PromptSnapshot {
  requestId!: string
  userId!: number
  username!: string
  userEmail!: string
  apiKeyId!: number
  apiKeyName!: string
  groupId?: number
  groupName!: string
  provider!: string
  endpoint!: string
  protocol!: string
  model!: string
  promptHash!: string
  redactedPreview!: string
  fullPrompt!: string
  promptLength!: number
  messageCount!: number
  stage!: string
}
