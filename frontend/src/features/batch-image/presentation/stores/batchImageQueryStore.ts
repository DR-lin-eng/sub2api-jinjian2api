import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { batchImageQueryRepository } from '@/features/batch-image/data/repositories/batchImageQueryRepositoryImpl'
import type { BatchImageQueryRepository } from '@/features/batch-image/domain/repositories/batchImageQueryRepository'

export function createBatchImageQueryStore(repo: BatchImageQueryRepository = batchImageQueryRepository) {
  return defineStore('batchImage/query', () => {
    const loading = reactive<Record<string, boolean>>({
      getById: false,
      list: false,
      listModels: false,
      listItems: false,
      getItemContent: false,
    })
    const errors = reactive<Record<string, unknown>>({
      getById: null,
      list: null,
      listModels: null,
      listItems: null,
      getItemContent: null,
    })

    const getById: BatchImageQueryRepository['getById'] = async (...args) => {
      loading.getById = true
      errors.getById = null
      try {
        return await repo.getById(...args)
      } catch (e) {
        errors.getById = e
        throw e
      } finally {
        loading.getById = false
      }
    }

    const list: BatchImageQueryRepository['list'] = async (...args) => {
      loading.list = true
      errors.list = null
      try {
        return await repo.list(...args)
      } catch (e) {
        errors.list = e
        throw e
      } finally {
        loading.list = false
      }
    }

    const listModels: BatchImageQueryRepository['listModels'] = async (...args) => {
      loading.listModels = true
      errors.listModels = null
      try {
        return await repo.listModels(...args)
      } catch (e) {
        errors.listModels = e
        throw e
      } finally {
        loading.listModels = false
      }
    }

    const listItems: BatchImageQueryRepository['listItems'] = async (...args) => {
      loading.listItems = true
      errors.listItems = null
      try {
        return await repo.listItems(...args)
      } catch (e) {
        errors.listItems = e
        throw e
      } finally {
        loading.listItems = false
      }
    }

    const getItemContent: BatchImageQueryRepository['getItemContent'] = async (...args) => {
      loading.getItemContent = true
      errors.getItemContent = null
      try {
        return await repo.getItemContent(...args)
      } catch (e) {
        errors.getItemContent = e
        throw e
      } finally {
        loading.getItemContent = false
      }
    }

    return { loading, errors, getById, list, listModels, listItems, getItemContent }
  })
}

export const useBatchImageQueryStore = createBatchImageQueryStore()
