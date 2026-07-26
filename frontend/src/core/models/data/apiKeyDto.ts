import 'reflect-metadata'
import {Expose, Transform, Type, plainToInstance} from 'class-transformer'
import {ApiKey} from '@/core/models/domain/apiKey'
import { GroupDto } from '@/core/models/data/groupDto'

export class ApiKeyDto {
    @Expose() id!: number

    @Expose({name: 'user_id'})
    @Transform(({value}) => value ?? 0)
    userId!: number

    @Expose()
    @Transform(({value}) => value ?? '')
    key!: string

    @Expose()
    @Transform(({value}) => value ?? '')
    name!: string

    @Expose({name: 'group_id'})
    @Transform(({value}) => value ?? 0)
    groupId!: number

    @Expose()
    @Transform(({value}) => value ?? 'inactive')
    status!: 'active' | 'inactive' | 'quota_exhausted' | 'expired'

    @Expose({name: 'ip_whitelist'})
    @Transform(({value}) => value ?? [])
    ipWhitelist!: string[]

    @Expose({name: 'ip_blacklist'})
    @Transform(({value}) => value ?? [])
    ipBlacklist!: string[]

    @Expose({name: 'last_used_at'})
    @Transform(({value}) => value ?? '')
    lastUsedAt!: string

    @Expose({name: 'last_used_ip'})
    @Transform(({value}) => value ?? '')
    lastUsedIp!: string

    @Expose()
    @Transform(({value}) => value ?? 0)
    quota!: number

    @Expose({name: 'quota_used'})
    @Transform(({value}) => value ?? 0)
    quotaUsed!: number

    @Expose({name: 'expires_at'})
    @Transform(({value}) => value ?? '')
    expiresAt!: string

    @Expose({name: 'created_at'})
    @Transform(({value}) => value ?? '')
    createdAt!: string

    @Expose({name: 'updated_at'})
    @Transform(({value}) => value ?? '')
    updatedAt!: string

    @Expose({name: 'concurrency_limit'})
    @Transform(({value}) => value ?? 0)
    concurrencyLimit!: number

    @Expose({name: 'current_concurrency'})
    @Transform(({value}) => value ?? 0)
    currentConcurrency!: number

    @Expose()
    @Type(() => GroupDto)
    group?: GroupDto

    @Expose({name: 'rate_limit_5h'})
    @Transform(({value}) => value ?? 0)
    rateLimit5h!: number

    @Expose({name: 'rate_limit_1d'})
    @Transform(({value}) => value ?? 0)
    rateLimit1d!: number

    @Expose({name: 'rate_limit_7d'})
    @Transform(({value}) => value ?? 0)
    rateLimit7d!: number

    @Expose({name: 'usage_5h'})
    @Transform(({value}) => value ?? 0)
    usage5h!: number

    @Expose({name: 'usage_1d'})
    @Transform(({value}) => value ?? 0)
    usage1d!: number

    @Expose({name: 'usage_7d'})
    @Transform(({value}) => value ?? 0)
    usage7d!: number

    @Expose({name: 'window_5h_start'})
    @Transform(({value}) => value ?? '')
    window5hStart!: string

    @Expose({name: 'window_1d_start'})
    @Transform(({value}) => value ?? '')
    window1dStart!: string

    @Expose({name: 'window_7d_start'})
    @Transform(({value}) => value ?? '')
    window7dStart!: string

    @Expose({name: 'reset_5h_at'})
    @Transform(({value}) => value ?? '')
    reset5hAt!: string

    @Expose({name: 'reset_1d_at'})
    @Transform(({value}) => value ?? '')
    reset1dAt!: string

    @Expose({name: 'reset_7d_at'})
    @Transform(({value}) => value ?? '')
    reset7dAt!: string

    static fromJson(json: unknown): ApiKeyDto {
        return plainToInstance(ApiKeyDto, json, {excludeExtraneousValues: true})
    }

    toEntity(): ApiKey {
        const entity = new ApiKey()
        entity.id = this.id
        entity.userId = this.userId
        entity.key = this.key
        entity.name = this.name
        entity.groupId = this.groupId
        entity.status = this.status
        entity.ipWhitelist = this.ipWhitelist
        entity.ipBlacklist = this.ipBlacklist
        entity.lastUsedAt = this.lastUsedAt
        entity.lastUsedIp = this.lastUsedIp
        entity.quota = this.quota
        entity.quotaUsed = this.quotaUsed
        entity.expiresAt = this.expiresAt
        entity.createdAt = this.createdAt
        entity.updatedAt = this.updatedAt
        entity.concurrencyLimit = this.concurrencyLimit
        entity.currentConcurrency = this.currentConcurrency
        entity.group = this.group?.toEntity()
        entity.rateLimit5h = this.rateLimit5h
        entity.rateLimit1d = this.rateLimit1d
        entity.rateLimit7d = this.rateLimit7d
        entity.usage5h = this.usage5h
        entity.usage1d = this.usage1d
        entity.usage7d = this.usage7d
        entity.window5hStart = this.window5hStart
        entity.window1dStart = this.window1dStart
        entity.window7dStart = this.window7dStart
        entity.reset5hAt = this.reset5hAt
        entity.reset1dAt = this.reset1dAt
        entity.reset7dAt = this.reset7dAt
        return entity
    }
}