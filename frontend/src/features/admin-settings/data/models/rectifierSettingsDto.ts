import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { RectifierSettings } from '@/features/admin-settings/domain/models/rectifierSettings'
import type { ThinkingDisplayMode } from '@/features/admin-settings/domain/models/streamTimeoutSettings'

export class RectifierSettingsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'thinking_signature_enabled' }) @Transform(({ value }) => value ?? false) thinkingSignatureEnabled!: boolean
  @Expose({ name: 'thinking_budget_enabled' }) @Transform(({ value }) => value ?? false) thinkingBudgetEnabled!: boolean
  @Expose({ name: 'thinking_display_mode' }) @Transform(({ value }) => value ?? 'off') thinkingDisplayMode!: ThinkingDisplayMode
  @Expose({ name: 'apikey_signature_enabled' }) @Transform(({ value }) => value ?? false) apikeySignatureEnabled!: boolean
  @Expose({ name: 'apikey_signature_patterns' }) @Transform(({ value }) => value ?? []) apikeySignaturePatterns!: string[]

  static fromJson(json: unknown): RectifierSettingsDto {
    return plainToInstance(RectifierSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): RectifierSettings {
    const e = new RectifierSettings()
    e.enabled = this.enabled
    e.thinkingSignatureEnabled = this.thinkingSignatureEnabled
    e.thinkingBudgetEnabled = this.thinkingBudgetEnabled
    e.thinkingDisplayMode = this.thinkingDisplayMode
    e.apikeySignatureEnabled = this.apikeySignatureEnabled
    e.apikeySignaturePatterns = this.apikeySignaturePatterns
    return e
  }
}
