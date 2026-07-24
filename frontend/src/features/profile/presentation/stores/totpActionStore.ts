import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { totpActionRepository } from '@/features/profile/data/repositories/totpActionRepositoryImpl'
import type { TotpActionRepository } from '@/features/profile/domain/repositories/totpActionRepository'

export function createTotpActionStore(repo: TotpActionRepository = totpActionRepository) {
  return defineStore('profile/totp/action', () => {
    const loading = reactive<Record<string, boolean>>({ sendVerifyCode: false, initiateSetup: false, enable: false, disable: false, stepUp: false })
    const errors = reactive<Record<string, unknown>>({ sendVerifyCode: null, initiateSetup: null, enable: null, disable: null, stepUp: null })

    const sendVerifyCode: TotpActionRepository['sendVerifyCode'] = (...args) => {
      loading.sendVerifyCode = true
      errors.sendVerifyCode = null
      return repo.sendVerifyCode(...args)
        .catch((e: unknown) => { errors.sendVerifyCode = e; throw e })
        .finally(() => { loading.sendVerifyCode = false })
    }

    const initiateSetup: TotpActionRepository['initiateSetup'] = (...args) => {
      loading.initiateSetup = true
      errors.initiateSetup = null
      return repo.initiateSetup(...args)
        .catch((e: unknown) => { errors.initiateSetup = e; throw e })
        .finally(() => { loading.initiateSetup = false })
    }

    const enable: TotpActionRepository['enable'] = (...args) => {
      loading.enable = true
      errors.enable = null
      return repo.enable(...args)
        .catch((e: unknown) => { errors.enable = e; throw e })
        .finally(() => { loading.enable = false })
    }

    const disable: TotpActionRepository['disable'] = (...args) => {
      loading.disable = true
      errors.disable = null
      return repo.disable(...args)
        .catch((e: unknown) => { errors.disable = e; throw e })
        .finally(() => { loading.disable = false })
    }

    const stepUp: TotpActionRepository['stepUp'] = (...args) => {
      loading.stepUp = true
      errors.stepUp = null
      return repo.stepUp(...args)
        .catch((e: unknown) => { errors.stepUp = e; throw e })
        .finally(() => { loading.stepUp = false })
    }

    return { loading, errors, sendVerifyCode, initiateSetup, enable, disable, stepUp }
  })
}

export const useTotpActionStore = createTotpActionStore()
