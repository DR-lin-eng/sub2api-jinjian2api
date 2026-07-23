/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  UserAvailableGroup,
  UserPricingInterval,
  UserSupportedModelPricing,
  UserSupportedModel,
  UserChannelPlatformSection,
  UserAvailableChannel
} from '@/features/channels-user/data/datasources/channelsUserDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUserAvailableGroup = (dto: UserAvailableGroup): UserAvailableGroup => dto
export const userAvailableGroupToDto = (entity: UserAvailableGroup): UserAvailableGroup => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUserPricingInterval = (dto: UserPricingInterval): UserPricingInterval => dto
export const userPricingIntervalToDto = (entity: UserPricingInterval): UserPricingInterval => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUserSupportedModelPricing = (dto: UserSupportedModelPricing): UserSupportedModelPricing => dto
export const userSupportedModelPricingToDto = (entity: UserSupportedModelPricing): UserSupportedModelPricing => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUserSupportedModel = (dto: UserSupportedModel): UserSupportedModel => dto
export const userSupportedModelToDto = (entity: UserSupportedModel): UserSupportedModel => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUserChannelPlatformSection = (dto: UserChannelPlatformSection): UserChannelPlatformSection => dto
export const userChannelPlatformSectionToDto = (entity: UserChannelPlatformSection): UserChannelPlatformSection => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUserAvailableChannel = (dto: UserAvailableChannel): UserAvailableChannel => dto
export const userAvailableChannelToDto = (entity: UserAvailableChannel): UserAvailableChannel => entity
