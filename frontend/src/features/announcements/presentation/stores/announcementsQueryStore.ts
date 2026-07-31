import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminAnnouncementsQueryRepository } from '@/features/announcements/domain/repositories/adminAnnouncementsQueryRepository'
import type { AnnouncementsQueryRepository } from '@/features/announcements/domain/repositories/announcementsQueryRepository'
import { adminAnnouncementsQueryRepository as defaultAdminQueryRepo } from '@/features/announcements/data/repositories/adminAnnouncementsQueryRepositoryImpl'
import { announcementsQueryRepository as defaultQueryRepo } from '@/features/announcements/data/repositories/announcementsQueryRepositoryImpl'

export function createAnnouncementsQueryStore(
  adminRepo: AdminAnnouncementsQueryRepository = defaultAdminQueryRepo,
  userRepo: AnnouncementsQueryRepository = defaultQueryRepo,
) {
  return defineStore('announcements/query', () => {
    const loading = reactive<Record<string, boolean>>({
      list: false,
      getById: false,
      getReadStatus: false,
      userList: false,
    })
    const errors = reactive<Record<string, unknown>>({
      list: null,
      getById: null,
      getReadStatus: null,
      userList: null,
    })

    const list: AdminAnnouncementsQueryRepository['list'] = async (...args) => {
      loading.list = true
      errors.list = null
      try {
        return await adminRepo.list(...args)
      } catch (e) {
        errors.list = e
        throw e
      } finally {
        loading.list = false
      }
    }

    const getById: AdminAnnouncementsQueryRepository['getById'] = async (...args) => {
      loading.getById = true
      errors.getById = null
      try {
        return await adminRepo.getById(...args)
      } catch (e) {
        errors.getById = e
        throw e
      } finally {
        loading.getById = false
      }
    }

    const getReadStatus: AdminAnnouncementsQueryRepository['getReadStatus'] = async (...args) => {
      loading.getReadStatus = true
      errors.getReadStatus = null
      try {
        return await adminRepo.getReadStatus(...args)
      } catch (e) {
        errors.getReadStatus = e
        throw e
      } finally {
        loading.getReadStatus = false
      }
    }

    const userList: AnnouncementsQueryRepository['list'] = async (...args) => {
      loading.userList = true
      errors.userList = null
      try {
        return await userRepo.list(...args)
      } catch (e) {
        errors.userList = e
        throw e
      } finally {
        loading.userList = false
      }
    }

    return { loading, errors, list, getById, getReadStatus, userList }
  })
}

export const useAnnouncementsQueryStore = createAnnouncementsQueryStore()
