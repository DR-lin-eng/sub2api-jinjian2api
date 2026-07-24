import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromptSnapshot } from '@/features/prompt-audit/domain/models/promptSnapshot'

export class PromptSnapshotDto {
  @Expose({ name: 'request_id' }) @Transform(({ value }) => value ?? '') requestId!: string
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number
  @Expose() @Transform(({ value }) => value ?? '') username!: string
  @Expose({ name: 'user_email' }) @Transform(({ value }) => value ?? '') userEmail!: string
  @Expose({ name: 'api_key_id' }) @Transform(({ value }) => value ?? 0) apiKeyId!: number
  @Expose({ name: 'api_key_name' }) @Transform(({ value }) => value ?? '') apiKeyName!: string
  @Expose({ name: 'group_id' }) groupId?: number
  @Expose({ name: 'group_name' }) @Transform(({ value }) => value ?? '') groupName!: string
  @Expose() @Transform(({ value }) => value ?? '') provider!: string
  @Expose() @Transform(({ value }) => value ?? '') endpoint!: string
  @Expose() @Transform(({ value }) => value ?? '') protocol!: string
  @Expose() @Transform(({ value }) => value ?? '') model!: string
  @Expose({ name: 'prompt_hash' }) @Transform(({ value }) => value ?? '') promptHash!: string
  @Expose({ name: 'redacted_preview' }) @Transform(({ value }) => value ?? '') redactedPreview!: string
  @Expose({ name: 'full_prompt' }) @Transform(({ value }) => value ?? '') fullPrompt!: string
  @Expose({ name: 'prompt_length' }) @Transform(({ value }) => value ?? 0) promptLength!: number
  @Expose({ name: 'message_count' }) @Transform(({ value }) => value ?? 0) messageCount!: number
  @Expose() @Transform(({ value }) => value ?? 'http') stage!: string

  static fromJson(json: unknown): PromptSnapshotDto {
    return plainToInstance(PromptSnapshotDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptSnapshot {
    const e = new PromptSnapshot()
    e.requestId = this.requestId
    e.userId = this.userId
    e.username = this.username
    e.userEmail = this.userEmail
    e.apiKeyId = this.apiKeyId
    e.apiKeyName = this.apiKeyName
    e.groupId = this.groupId
    e.groupName = this.groupName
    e.provider = this.provider
    e.endpoint = this.endpoint
    e.protocol = this.protocol
    e.model = this.model
    e.promptHash = this.promptHash
    e.redactedPreview = this.redactedPreview
    e.fullPrompt = this.fullPrompt
    e.promptLength = this.promptLength
    e.messageCount = this.messageCount
    e.stage = this.stage
    return e
  }
}
