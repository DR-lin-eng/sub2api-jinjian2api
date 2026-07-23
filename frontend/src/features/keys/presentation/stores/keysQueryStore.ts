/**
 * KeysQueryStore — per spec §5.4 R5.1 (factory + default defineStore).
 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { KeysQueryRepository } from '@/features/keys/domain/repositories/keysQueryRepository'
import { keysQueryRepository as defaultRepo } from '@/features/keys/data/repositories/keysQueryRepositoryImpl'

export function createKeysQueryStore(repo: KeysQueryRepository = defaultRepo) {
  return defineStore('keys/query', () => {
    const loading = reactive<Record<string, boolean>>({ list: false, getById: false })
    const errors = reactive<Record<string, unknown>>({ list: null, getById: null })

    const list: KeysQueryRepository['list'] = (async (...args: unknown[]) => {
      loading.list = true
      errors.list = null
      try {
        try {
          await Promise.resolve()
          return (repo.list as (...a: unknown[]) => unknown)(...args)
        } catch (e) {
          errors.list = e;
          throw e
        }
      } finally {
        loading.list = false
      }
    }) as KeysQueryRepository['list']

    const getById: KeysQueryRepository['getById'] = (async (...args: unknown[]) => {
      loading.getById = true
      errors.getById = null
      try {
        try {
          await Promise.resolve()
          return (repo.getById as (...a: unknown[]) => unknown)(...args)
        } catch (e) {
          errors.getById = e;
          throw e
        }
      } finally {
        loading.getById = false
      }
    }) as KeysQueryRepository['getById']

    return { loading, errors, list, getById }
  })
}

export const useKeysQueryStore = createKeysQueryStore()
