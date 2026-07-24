import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AuthQueryRepository } from '@/features/auth/domain/repositories/authQueryRepository'
import { authQueryRepository as default_repo } from '@/features/auth/data/repositories/authQueryRepositoryImpl'

export function createAuthQueryStore(repo: AuthQueryRepository = default_repo) {
  return defineStore('auth/query', () => {
    const loading = reactive<Record<string, boolean>>({
      getCurrentUser: false,
      getPublicSettings: false,
      getLocalCaptcha: false,
    })
    const errors = reactive<Record<string, unknown>>({
      getCurrentUser: null,
      getPublicSettings: null,
      getLocalCaptcha: null,
    })

    const getCurrentUser: AuthQueryRepository['getCurrentUser'] = ((...args: unknown[]) => {
      loading.getCurrentUser = true
      errors.getCurrentUser = null
      return Promise.resolve()
        .then(() => (repo.getCurrentUser as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getCurrentUser = e; throw e })
        .finally(() => { loading.getCurrentUser = false })
    }) as AuthQueryRepository['getCurrentUser']

    const getPublicSettings: AuthQueryRepository['getPublicSettings'] = ((...args: unknown[]) => {
      loading.getPublicSettings = true
      errors.getPublicSettings = null
      return Promise.resolve()
        .then(() => (repo.getPublicSettings as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getPublicSettings = e; throw e })
        .finally(() => { loading.getPublicSettings = false })
    }) as AuthQueryRepository['getPublicSettings']

    const getLocalCaptcha: AuthQueryRepository['getLocalCaptcha'] = ((...args: unknown[]) => {
      loading.getLocalCaptcha = true
      errors.getLocalCaptcha = null
      return Promise.resolve()
        .then(() => (repo.getLocalCaptcha as (...a: unknown[]) => unknown)(...args))
        .catch((e: unknown) => { errors.getLocalCaptcha = e; throw e })
        .finally(() => { loading.getLocalCaptcha = false })
    }) as AuthQueryRepository['getLocalCaptcha']

    return { loading, errors, getCurrentUser, getPublicSettings, getLocalCaptcha }
  })
}

export const useAuthQueryStore = createAuthQueryStore()
