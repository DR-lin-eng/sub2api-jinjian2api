import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminSettingsActionRepository } from '@/features/admin-settings/domain/repositories/adminSettingsActionRepository'
import type { ErrorPassthroughActionRepository } from '@/features/admin-settings/domain/repositories/errorPassthroughActionRepository'
import type { SystemActionRepository } from '@/features/admin-settings/domain/repositories/systemActionRepository'
import type { TlsFingerprintProfileActionRepository } from '@/features/admin-settings/domain/repositories/tlsFingerprintProfileActionRepository'
import type { ComplianceActionRepository } from '@/features/admin-settings/domain/repositories/complianceActionRepository'
import { adminSettingsActionRepository } from '@/features/admin-settings/data/repositories/adminSettingsActionRepositoryImpl'
import { errorPassthroughActionRepository } from '@/features/admin-settings/data/repositories/errorPassthroughActionRepositoryImpl'
import { systemActionRepository } from '@/features/admin-settings/data/repositories/systemActionRepositoryImpl'
import { tlsFingerprintProfileActionRepository } from '@/features/admin-settings/data/repositories/tlsFingerprintProfileActionRepositoryImpl'
import { complianceActionRepository } from '@/features/admin-settings/data/repositories/complianceActionRepositoryImpl'

export function createAdminSettingsActionStore(
  adminSettingsRepo: AdminSettingsActionRepository = adminSettingsActionRepository,
  errorPassthroughRepo: ErrorPassthroughActionRepository = errorPassthroughActionRepository,
  systemRepo: SystemActionRepository = systemActionRepository,
  tlsFingerprintProfileRepo: TlsFingerprintProfileActionRepository = tlsFingerprintProfileActionRepository,
  complianceRepo: ComplianceActionRepository = complianceActionRepository,
) {
  return defineStore('adminSettings/action', () => {
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

    const updateSettings = (req: Parameters<AdminSettingsActionRepository['updateSettings']>[0]) =>
      wrap('updateSettings', () => adminSettingsRepo.updateSettings(req))
    const testSmtpConnection = (req: Parameters<AdminSettingsActionRepository['testSmtpConnection']>[0]) =>
      wrap('testSmtpConnection', () => adminSettingsRepo.testSmtpConnection(req))
    const sendTestEmail = (req: Parameters<AdminSettingsActionRepository['sendTestEmail']>[0]) =>
      wrap('sendTestEmail', () => adminSettingsRepo.sendTestEmail(req))
    const updateEmailTemplate = (event: string, locale: string, req: Parameters<AdminSettingsActionRepository['updateEmailTemplate']>[2]) =>
      wrap('updateEmailTemplate', () => adminSettingsRepo.updateEmailTemplate(event, locale, req))
    const restoreOfficialEmailTemplate = (event: string, locale: string) =>
      wrap('restoreOfficialEmailTemplate', () => adminSettingsRepo.restoreOfficialEmailTemplate(event, locale))
    const previewEmailTemplate = (req: Parameters<AdminSettingsActionRepository['previewEmailTemplate']>[0]) =>
      wrap('previewEmailTemplate', () => adminSettingsRepo.previewEmailTemplate(req))
    const createAdminApiKey = (req: Parameters<AdminSettingsActionRepository['createAdminApiKey']>[0]) =>
      wrap('createAdminApiKey', () => adminSettingsRepo.createAdminApiKey(req))
    const updateAdminApiKey = (id: string, req: Parameters<AdminSettingsActionRepository['updateAdminApiKey']>[1]) =>
      wrap('updateAdminApiKey', () => adminSettingsRepo.updateAdminApiKey(id, req))
    const rotateAdminApiKey = (id: string) =>
      wrap('rotateAdminApiKey', () => adminSettingsRepo.rotateAdminApiKey(id))
    const revokeAdminApiKey = (id: string) =>
      wrap('revokeAdminApiKey', () => adminSettingsRepo.revokeAdminApiKey(id))
    const regenerateAdminApiKey = () =>
      wrap('regenerateAdminApiKey', () => adminSettingsRepo.regenerateAdminApiKey())
    const deleteAdminApiKey = () =>
      wrap('deleteAdminApiKey', () => adminSettingsRepo.deleteAdminApiKey())
    const updateOverloadCooldownSettings = (req: Parameters<AdminSettingsActionRepository['updateOverloadCooldownSettings']>[0]) =>
      wrap('updateOverloadCooldownSettings', () => adminSettingsRepo.updateOverloadCooldownSettings(req))
    const updateRateLimit429CooldownSettings = (req: Parameters<AdminSettingsActionRepository['updateRateLimit429CooldownSettings']>[0]) =>
      wrap('updateRateLimit429CooldownSettings', () => adminSettingsRepo.updateRateLimit429CooldownSettings(req))
    const updateGlobalTempUnschedulableSettings = (req: Parameters<AdminSettingsActionRepository['updateGlobalTempUnschedulableSettings']>[0]) =>
      wrap('updateGlobalTempUnschedulableSettings', () => adminSettingsRepo.updateGlobalTempUnschedulableSettings(req))
    const updateStreamTimeoutSettings = (req: Parameters<AdminSettingsActionRepository['updateStreamTimeoutSettings']>[0]) =>
      wrap('updateStreamTimeoutSettings', () => adminSettingsRepo.updateStreamTimeoutSettings(req))
    const updateRectifierSettings = (req: Parameters<AdminSettingsActionRepository['updateRectifierSettings']>[0]) =>
      wrap('updateRectifierSettings', () => adminSettingsRepo.updateRectifierSettings(req))
    const updateBetaPolicySettings = (req: Parameters<AdminSettingsActionRepository['updateBetaPolicySettings']>[0]) =>
      wrap('updateBetaPolicySettings', () => adminSettingsRepo.updateBetaPolicySettings(req))
    const updateWebSearchEmulationConfig = (req: Parameters<AdminSettingsActionRepository['updateWebSearchEmulationConfig']>[0]) =>
      wrap('updateWebSearchEmulationConfig', () => adminSettingsRepo.updateWebSearchEmulationConfig(req))
    const testWebSearchEmulation = (query: string, provider?: string) =>
      wrap('testWebSearchEmulation', () => adminSettingsRepo.testWebSearchEmulation(query, provider))
    const resetWebSearchUsage = (provider: string) =>
      wrap('resetWebSearchUsage', () => adminSettingsRepo.resetWebSearchUsage(provider))

    const createErrorPassthroughRule = (req: Parameters<ErrorPassthroughActionRepository['create']>[0]) =>
      wrap('createErrorPassthroughRule', () => errorPassthroughRepo.create(req))
    const updateErrorPassthroughRule = (id: number, req: Parameters<ErrorPassthroughActionRepository['update']>[1]) =>
      wrap('updateErrorPassthroughRule', () => errorPassthroughRepo.update(id, req))
    const deleteErrorPassthroughRule = (id: number) =>
      wrap('deleteErrorPassthroughRule', () => errorPassthroughRepo.deleteRule(id))
    const toggleErrorPassthroughEnabled = (id: number, enabled: boolean) =>
      wrap('toggleErrorPassthroughEnabled', () => errorPassthroughRepo.toggleEnabled(id, enabled))

    const performUpdate = () => wrap('performUpdate', () => systemRepo.performUpdate())
    const rollback = (version?: string) => wrap('rollback', () => systemRepo.rollback(version))
    const restartService = () => wrap('restartService', () => systemRepo.restartService())

    const createTlsProfile = (req: Parameters<TlsFingerprintProfileActionRepository['create']>[0]) =>
      wrap('createTlsProfile', () => tlsFingerprintProfileRepo.create(req))
    const updateTlsProfile = (id: number, req: Parameters<TlsFingerprintProfileActionRepository['update']>[1]) =>
      wrap('updateTlsProfile', () => tlsFingerprintProfileRepo.update(id, req))
    const deleteTlsProfile = (id: number) =>
      wrap('deleteTlsProfile', () => tlsFingerprintProfileRepo.deleteProfile(id))

    const acceptCompliance = (req: Parameters<ComplianceActionRepository['accept']>[0]) =>
      wrap('acceptCompliance', () => complianceRepo.accept(req))

    return {
      loading, errors,
      updateSettings, testSmtpConnection, sendTestEmail,
      updateEmailTemplate, restoreOfficialEmailTemplate, previewEmailTemplate,
      createAdminApiKey, updateAdminApiKey, rotateAdminApiKey, revokeAdminApiKey,
      regenerateAdminApiKey, deleteAdminApiKey,
      updateOverloadCooldownSettings, updateRateLimit429CooldownSettings,
      updateGlobalTempUnschedulableSettings, updateStreamTimeoutSettings,
      updateRectifierSettings, updateBetaPolicySettings,
      updateWebSearchEmulationConfig, testWebSearchEmulation, resetWebSearchUsage,
      createErrorPassthroughRule, updateErrorPassthroughRule,
      deleteErrorPassthroughRule, toggleErrorPassthroughEnabled,
      performUpdate, rollback, restartService,
      createTlsProfile, updateTlsProfile, deleteTlsProfile,
      acceptCompliance,
    }
  })
}

export const useAdminSettingsActionStore = createAdminSettingsActionStore()
