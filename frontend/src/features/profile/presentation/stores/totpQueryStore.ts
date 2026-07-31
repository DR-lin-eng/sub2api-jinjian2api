import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { totpQueryRepository } from '@/features/profile/data/repositories/totpQueryRepositoryImpl'
import type { TotpQueryRepository } from '@/features/profile/domain/repositories/totpQueryRepository'

export function createTotpQueryStore(repo: TotpQueryRepository = totpQueryRepository) {
  return defineStore('profile/totp/query', () => {
    const loading = reactive<Record<string, boolean>>({ getStatus: false, getVerificationMethod: false })
    const errors = reactive<Record<string, unknown>>({ getStatus: null, getVerificationMethod: null })

    const getStatus: TotpQueryRepository['getStatus'] = (...args) => {
      loading.getStatus = true
      errors.getStatus = null
      return repo.getStatus(...args)
        .catch((e: unknown) => { errors.getStatus = e; throw e })
        .finally(() => { loading.getStatus = false })
    }

    const getVerificationMethod: TotpQueryRepository['getVerificationMethod'] = (...args) => {
      loading.getVerificationMethod = true
      errors.getVerificationMethod = null
      return repo.getVerificationMethod(...args)
        .catch((e: unknown) => { errors.getVerificationMethod = e; throw e })
        .finally(() => { loading.getVerificationMethod = false })
    }

    return { loading, errors, getStatus, getVerificationMethod }
  })
}

export const useTotpQueryStore = createTotpQueryStore()
