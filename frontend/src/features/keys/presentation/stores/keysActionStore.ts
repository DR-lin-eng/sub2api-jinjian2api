/**
 * KeysActionStore — per spec §5.4 R5.1 (factory + default defineStore).
 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { KeysActionRepository } from '@/features/keys/domain/repositories/keysActionRepository'
import { keysActionRepository as defaultRepo } from '@/features/keys/data/repositories/keysActionRepositoryImpl'

export function createKeysActionStore(repo: KeysActionRepository = defaultRepo) {
  return defineStore('keys/action', () => {
    const loading = reactive<Record<string, boolean>>({
      create: false, update: false, deleteKey: false, toggleStatus: false,
    })
    const errors = reactive<Record<string, unknown>>({
      create: null, update: null, deleteKey: null, toggleStatus: null,
    })

    const create: KeysActionRepository['create'] = (async (...args: unknown[]) => {
      loading.create = true
      errors.create = null
      try {
        try {
          await Promise.resolve()
          return (repo.create as (...a: unknown[]) => unknown)(...args)
        } catch (e) {
          errors.create = e;
          throw e
        }
      } finally {
        loading.create = false
      }
    }) as KeysActionRepository['create']

    const update: KeysActionRepository['update'] = (async (...args: unknown[]) => {
      loading.update = true
      errors.update = null
      try {
        try {
          await Promise.resolve()
          return (repo.update as (...a: unknown[]) => unknown)(...args)
        } catch (e) {
          errors.update = e;
          throw e
        }
      } finally {
        loading.update = false
      }
    }) as KeysActionRepository['update']

    const deleteKey: KeysActionRepository['deleteKey'] = (async (...args: unknown[]) => {
      loading.deleteKey = true
      errors.deleteKey = null
      try {
        try {
          await Promise.resolve()
          return (repo.deleteKey as (...a: unknown[]) => unknown)(...args)
        } catch (e) {
          errors.deleteKey = e;
          throw e
        }
      } finally {
        loading.deleteKey = false
      }
    }) as KeysActionRepository['deleteKey']

    const toggleStatus: KeysActionRepository['toggleStatus'] = (async (...args: unknown[]) => {
      loading.toggleStatus = true
      errors.toggleStatus = null
      try {
        try {
          await Promise.resolve()
          return (repo.toggleStatus as (...a: unknown[]) => unknown)(...args)
        } catch (e) {
          errors.toggleStatus = e;
          throw e
        }
      } finally {
        loading.toggleStatus = false
      }
    }) as KeysActionRepository['toggleStatus']

    return { loading, errors, create, update, deleteKey, toggleStatus }
  })
}

export const useKeysActionStore = createKeysActionStore()
