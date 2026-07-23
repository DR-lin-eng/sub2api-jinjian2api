import 'reflect-metadata'
import { Expose, plainToInstance } from 'class-transformer'
import { OpenAIMessagesDispatchModelConfig } from '@/features/admin-groups/domain/models/openAIMessagesDispatchModelConfig'

export class OpenAIMessagesDispatchModelConfigDto {
  @Expose({ name: 'opus_mapped_model' })
  opusMappedModel?: string

  @Expose({ name: 'sonnet_mapped_model' })
  sonnetMappedModel?: string

  @Expose({ name: 'haiku_mapped_model' })
  haikuMappedModel?: string

  @Expose({ name: 'exact_model_mappings' })
  exactModelMappings?: Record<string, string>

  static fromJson(json: unknown): OpenAIMessagesDispatchModelConfigDto {
    return plainToInstance(OpenAIMessagesDispatchModelConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIMessagesDispatchModelConfig {
    const entity = new OpenAIMessagesDispatchModelConfig()
    entity.opusMappedModel = this.opusMappedModel
    entity.sonnetMappedModel = this.sonnetMappedModel
    entity.haikuMappedModel = this.haikuMappedModel
    entity.exactModelMappings = this.exactModelMappings
    return entity
  }
}
