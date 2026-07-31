import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { ProfileQueryRepository } from '@/features/profile/domain/repositories/profileQueryRepository'
import type { TotpQueryRepository } from '@/features/profile/domain/repositories/totpQueryRepository'
import { profileQueryRepository as defaultProfileRepo } from '@/features/profile/data/repositories/profileQueryRepositoryImpl'
import { totpQueryRepository as defaultTotpRepo } from '@/features/profile/data/repositories/totpQueryRepositoryImpl'

export function createProfileQueryStore(
  profileRepo: ProfileQueryRepository = defaultProfileRepo,
  totpRepo: TotpQueryRepository = defaultTotpRepo,
) {
  return defineStore('profile/query', () => {
    const loading = reactive<Record<string, boolean>>({
      getProfile: false,
      getAffiliateDetail: false,
      getMyPlatformQuotas: false,
      getStatus: false,
      getVerificationMethod: false,
    })
    const errors = reactive<Record<string, unknown>>({
      getProfile: null,
      getAffiliateDetail: null,
      getMyPlatformQuotas: null,
      getStatus: null,
      getVerificationMethod: null,
    })

    async function getProfile() {
      loading.getProfile = true
      errors.getProfile = null
      try {
        return await profileRepo.getProfile()
      } catch (e) {
        errors.getProfile = e
        throw e
      } finally {
        loading.getProfile = false
      }
    }

    async function getAffiliateDetail() {
      loading.getAffiliateDetail = true
      errors.getAffiliateDetail = null
      try {
        return await profileRepo.getAffiliateDetail()
      } catch (e) {
        errors.getAffiliateDetail = e
        throw e
      } finally {
        loading.getAffiliateDetail = false
      }
    }

    async function getMyPlatformQuotas() {
      loading.getMyPlatformQuotas = true
      errors.getMyPlatformQuotas = null
      try {
        return await profileRepo.getMyPlatformQuotas()
      } catch (e) {
        errors.getMyPlatformQuotas = e
        throw e
      } finally {
        loading.getMyPlatformQuotas = false
      }
    }

    async function getStatus() {
      loading.getStatus = true
      errors.getStatus = null
      try {
        return await totpRepo.getStatus()
      } catch (e) {
        errors.getStatus = e
        throw e
      } finally {
        loading.getStatus = false
      }
    }

    async function getVerificationMethod() {
      loading.getVerificationMethod = true
      errors.getVerificationMethod = null
      try {
        return await totpRepo.getVerificationMethod()
      } catch (e) {
        errors.getVerificationMethod = e
        throw e
      } finally {
        loading.getVerificationMethod = false
      }
    }

    return { loading, errors, getProfile, getAffiliateDetail, getMyPlatformQuotas, getStatus, getVerificationMethod }
  })
}

export const useProfileQueryStore = createProfileQueryStore()
