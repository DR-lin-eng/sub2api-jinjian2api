import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminSettingsQueryRepository } from '@/features/admin-settings/domain/repositories/adminSettingsQueryRepository'
import type { ErrorPassthroughQueryRepository } from '@/features/admin-settings/domain/repositories/errorPassthroughQueryRepository'
import type { SystemQueryRepository } from '@/features/admin-settings/domain/repositories/systemQueryRepository'
import type { TlsFingerprintProfileQueryRepository } from '@/features/admin-settings/domain/repositories/tlsFingerprintProfileQueryRepository'
import type { ComplianceQueryRepository } from '@/features/admin-settings/domain/repositories/complianceQueryRepository'
import { adminSettingsQueryRepository } from '@/features/admin-settings/data/repositories/adminSettingsQueryRepositoryImpl'
import { errorPassthroughQueryRepository } from '@/features/admin-settings/data/repositories/errorPassthroughQueryRepositoryImpl'
import { systemQueryRepository } from '@/features/admin-settings/data/repositories/systemQueryRepositoryImpl'
import { tlsFingerprintProfileQueryRepository } from '@/features/admin-settings/data/repositories/tlsFingerprintProfileQueryRepositoryImpl'
import { complianceQueryRepository } from '@/features/admin-settings/data/repositories/complianceQueryRepositoryImpl'

export function createAdminSettingsQueryStore(
  adminSettingsRepo: AdminSettingsQueryRepository = adminSettingsQueryRepository,
  errorPassthroughRepo: ErrorPassthroughQueryRepository = errorPassthroughQueryRepository,
  systemRepo: SystemQueryRepository = systemQueryRepository,
  tlsFingerprintProfileRepo: TlsFingerprintProfileQueryRepository = tlsFingerprintProfileQueryRepository,
  complianceRepo: ComplianceQueryRepository = complianceQueryRepository,
) {
  return defineStore('adminSettings/query', () => {
    const loading = reactive<Record<string, boolean>>({})
    const errors = reactive<Record<string, unknown>>({})

    function wrap<T>(key: string, fn: () => Promise<T>): Promise<T> {
      loading[key] = true
      errors[key] = null
      return Promise.resolve()
        .then(fn)
        .catch((err: unknown) => { errors[key] = err; throw err })
        .finally(() => { loading[key] = false })
    }

    const getSettings = () => wrap('getSettings', () => adminSettingsRepo.getSettings())
    const getEmailTemplates = () => wrap('getEmailTemplates', () => adminSettingsRepo.getEmailTemplates())
    const getEmailTemplate = (event: string, locale: string) => wrap('getEmailTemplate', () => adminSettingsRepo.getEmailTemplate(event, locale))
    const listAdminApiKeys = () => wrap('listAdminApiKeys', () => adminSettingsRepo.listAdminApiKeys())
    const getAdminApiKey = () => wrap('getAdminApiKey', () => adminSettingsRepo.getAdminApiKey())
    const getOverloadCooldownSettings = () => wrap('getOverloadCooldownSettings', () => adminSettingsRepo.getOverloadCooldownSettings())
    const getRateLimit429CooldownSettings = () => wrap('getRateLimit429CooldownSettings', () => adminSettingsRepo.getRateLimit429CooldownSettings())
    const getGlobalTempUnschedulableSettings = () => wrap('getGlobalTempUnschedulableSettings', () => adminSettingsRepo.getGlobalTempUnschedulableSettings())
    const getStreamTimeoutSettings = () => wrap('getStreamTimeoutSettings', () => adminSettingsRepo.getStreamTimeoutSettings())
    const getRectifierSettings = () => wrap('getRectifierSettings', () => adminSettingsRepo.getRectifierSettings())
    const getBetaPolicySettings = () => wrap('getBetaPolicySettings', () => adminSettingsRepo.getBetaPolicySettings())
    const getWebSearchEmulationConfig = () => wrap('getWebSearchEmulationConfig', () => adminSettingsRepo.getWebSearchEmulationConfig())

    const listErrorPassthroughRules = () => wrap('listErrorPassthroughRules', () => errorPassthroughRepo.list())
    const getErrorPassthroughRuleById = (id: number) => wrap('getErrorPassthroughRuleById', () => errorPassthroughRepo.getById(id))

    const getVersion = () => wrap('getVersion', () => systemRepo.getVersion())
    const checkUpdates = (force?: boolean) => wrap('checkUpdates', () => systemRepo.checkUpdates(force))
    const getRollbackVersions = () => wrap('getRollbackVersions', () => systemRepo.getRollbackVersions())

    const listTlsProfiles = () => wrap('listTlsProfiles', () => tlsFingerprintProfileRepo.list())
    const getTlsProfileById = (id: number) => wrap('getTlsProfileById', () => tlsFingerprintProfileRepo.getById(id))

    const getComplianceStatus = () => wrap('getComplianceStatus', () => complianceRepo.getStatus())

    return {
      loading, errors,
      getSettings, getEmailTemplates, getEmailTemplate,
      listAdminApiKeys, getAdminApiKey,
      getOverloadCooldownSettings, getRateLimit429CooldownSettings,
      getGlobalTempUnschedulableSettings, getStreamTimeoutSettings,
      getRectifierSettings, getBetaPolicySettings, getWebSearchEmulationConfig,
      listErrorPassthroughRules, getErrorPassthroughRuleById,
      getVersion, checkUpdates, getRollbackVersions,
      listTlsProfiles, getTlsProfileById,
      getComplianceStatus,
    }
  })
}

export const useAdminSettingsQueryStore = createAdminSettingsQueryStore()
