import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminAnnouncementsActionRepository } from '@/features/announcements/domain/repositories/adminAnnouncementsActionRepository'
import type { AnnouncementsActionRepository } from '@/features/announcements/domain/repositories/announcementsActionRepository'
import { adminAnnouncementsActionRepository as defaultAdminActionRepo } from '@/features/announcements/data/repositories/adminAnnouncementsActionRepositoryImpl'
import { announcementsActionRepository as defaultActionRepo } from '@/features/announcements/data/repositories/announcementsActionRepositoryImpl'

export function createAnnouncementsActionStore(
  adminRepo: AdminAnnouncementsActionRepository = defaultAdminActionRepo,
  userRepo: AnnouncementsActionRepository = defaultActionRepo,
) {
  return defineStore('announcements/action', () => {
    const loading = reactive<Record<string, boolean>>({
      create: false,
      update: false,
      deleteAnnouncement: false,
      markRead: false,
    })
    const errors = reactive<Record<string, unknown>>({
      create: null,
      update: null,
      deleteAnnouncement: null,
      markRead: null,
    })

    const create: AdminAnnouncementsActionRepository['create'] = async (...args) => {
      loading.create = true
      errors.create = null
      try {
        return await adminRepo.create(...args)
      } catch (e) {
        errors.create = e
        throw e
      } finally {
        loading.create = false
      }
    }

    const update: AdminAnnouncementsActionRepository['update'] = async (...args) => {
      loading.update = true
      errors.update = null
      try {
        return await adminRepo.update(...args)
      } catch (e) {
        errors.update = e
        throw e
      } finally {
        loading.update = false
      }
    }

    const deleteAnnouncement: AdminAnnouncementsActionRepository['deleteAnnouncement'] = async (
      ...args
    ) => {
      loading.deleteAnnouncement = true
      errors.deleteAnnouncement = null
      try {
        return await adminRepo.deleteAnnouncement(...args)
      } catch (e) {
        errors.deleteAnnouncement = e
        throw e
      } finally {
        loading.deleteAnnouncement = false
      }
    }

    const markRead: AnnouncementsActionRepository['markRead'] = async (...args) => {
      loading.markRead = true
      errors.markRead = null
      try {
        return await userRepo.markRead(...args)
      } catch (e) {
        errors.markRead = e
        throw e
      } finally {
        loading.markRead = false
      }
    }

    return { loading, errors, create, update, deleteAnnouncement, markRead }
  })
}

export const useAnnouncementsActionStore = createAnnouncementsActionStore()
