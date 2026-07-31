import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { batchImageActionRepository } from '@/features/batch-image/data/repositories/batchImageActionRepositoryImpl'
import type { BatchImageActionRepository } from '@/features/batch-image/domain/repositories/batchImageActionRepository'

export function createBatchImageActionStore(repo: BatchImageActionRepository = batchImageActionRepository) {
  return defineStore('batchImage/action', () => {
    const loading = reactive<Record<string, boolean>>({
      submit: false,
      cancel: false,
      downloadZip: false,
      deleteRecord: false,
    })
    const errors = reactive<Record<string, unknown>>({
      submit: null,
      cancel: null,
      downloadZip: null,
      deleteRecord: null,
    })

    const submit: BatchImageActionRepository['submit'] = async (...args) => {
      loading.submit = true
      errors.submit = null
      try {
        return await repo.submit(...args)
      } catch (e) {
        errors.submit = e
        throw e
      } finally {
        loading.submit = false
      }
    }

    const cancel: BatchImageActionRepository['cancel'] = async (...args) => {
      loading.cancel = true
      errors.cancel = null
      try {
        return await repo.cancel(...args)
      } catch (e) {
        errors.cancel = e
        throw e
      } finally {
        loading.cancel = false
      }
    }

    const downloadZip: BatchImageActionRepository['downloadZip'] = async (...args) => {
      loading.downloadZip = true
      errors.downloadZip = null
      try {
        return await repo.downloadZip(...args)
      } catch (e) {
        errors.downloadZip = e
        throw e
      } finally {
        loading.downloadZip = false
      }
    }

    const deleteRecord: BatchImageActionRepository['deleteRecord'] = async (...args) => {
      loading.deleteRecord = true
      errors.deleteRecord = null
      try {
        return await repo.deleteRecord(...args)
      } catch (e) {
        errors.deleteRecord = e
        throw e
      } finally {
        loading.deleteRecord = false
      }
    }

    const saveBlob: BatchImageActionRepository['saveBlob'] = (...args) => repo.saveBlob(...args)

    return { loading, errors, submit, cancel, downloadZip, deleteRecord, saveBlob }
  })
}

export const useBatchImageActionStore = createBatchImageActionStore()
