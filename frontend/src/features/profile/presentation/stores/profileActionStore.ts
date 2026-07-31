import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { ProfileActionRepository } from '@/features/profile/domain/repositories/profileActionRepository'
import type { TotpActionRepository } from '@/features/profile/domain/repositories/totpActionRepository'
import { profileActionRepository as defaultProfileRepo } from '@/features/profile/data/repositories/profileActionRepositoryImpl'
import { totpActionRepository as defaultTotpRepo } from '@/features/profile/data/repositories/totpActionRepositoryImpl'
import type { UpdateProfileRequest } from '@/features/profile/data/requests_models/updateProfileRequest'
import type { ChangePasswordRequest } from '@/features/profile/data/requests_models/changePasswordRequest'
import type { BindEmailRequest } from '@/features/profile/data/requests_models/bindEmailRequest'
import type { BindableOAuthProvider } from '@/features/profile/data/datasources/profileActionDatasource'
import type { TotpSetupRequest } from '@/features/profile/data/requests_models/totpSetupRequest'
import type { TotpEnableRequest } from '@/features/profile/data/requests_models/totpEnableRequest'
import type { TotpDisableRequest } from '@/features/profile/data/requests_models/totpDisableRequest'

export function createProfileActionStore(
  profileRepo: ProfileActionRepository = defaultProfileRepo,
  totpRepo: TotpActionRepository = defaultTotpRepo,
) {
  return defineStore('profile/action', () => {
    const loading = reactive<Record<string, boolean>>({
      updateProfile: false,
      changePassword: false,
      sendNotifyEmailCode: false,
      verifyNotifyEmail: false,
      removeNotifyEmail: false,
      toggleNotifyEmail: false,
      sendEmailBindingCode: false,
      bindEmailIdentity: false,
      unbindAuthIdentity: false,
      startOAuthBinding: false,
      transferAffiliateQuota: false,
      sendVerifyCode: false,
      initiateSetup: false,
      enable: false,
      disable: false,
      stepUp: false,
    })
    const errors = reactive<Record<string, unknown>>({
      updateProfile: null,
      changePassword: null,
      sendNotifyEmailCode: null,
      verifyNotifyEmail: null,
      removeNotifyEmail: null,
      toggleNotifyEmail: null,
      sendEmailBindingCode: null,
      bindEmailIdentity: null,
      unbindAuthIdentity: null,
      startOAuthBinding: null,
      transferAffiliateQuota: null,
      sendVerifyCode: null,
      initiateSetup: null,
      enable: null,
      disable: null,
      stepUp: null,
    })

    async function updateProfile(req: UpdateProfileRequest) {
      loading.updateProfile = true; errors.updateProfile = null
      try { return await profileRepo.updateProfile(req) }
      catch (e) { errors.updateProfile = e; throw e }
      finally { loading.updateProfile = false }
    }

    async function changePassword(req: ChangePasswordRequest) {
      loading.changePassword = true; errors.changePassword = null
      try { return await profileRepo.changePassword(req) }
      catch (e) { errors.changePassword = e; throw e }
      finally { loading.changePassword = false }
    }

    async function sendNotifyEmailCode(email: string) {
      loading.sendNotifyEmailCode = true; errors.sendNotifyEmailCode = null
      try { return await profileRepo.sendNotifyEmailCode(email) }
      catch (e) { errors.sendNotifyEmailCode = e; throw e }
      finally { loading.sendNotifyEmailCode = false }
    }

    async function verifyNotifyEmail(email: string, code: string) {
      loading.verifyNotifyEmail = true; errors.verifyNotifyEmail = null
      try { return await profileRepo.verifyNotifyEmail(email, code) }
      catch (e) { errors.verifyNotifyEmail = e; throw e }
      finally { loading.verifyNotifyEmail = false }
    }

    async function removeNotifyEmail(email: string) {
      loading.removeNotifyEmail = true; errors.removeNotifyEmail = null
      try { return await profileRepo.removeNotifyEmail(email) }
      catch (e) { errors.removeNotifyEmail = e; throw e }
      finally { loading.removeNotifyEmail = false }
    }

    async function toggleNotifyEmail(email: string, disabled: boolean) {
      loading.toggleNotifyEmail = true; errors.toggleNotifyEmail = null
      try { return await profileRepo.toggleNotifyEmail(email, disabled) }
      catch (e) { errors.toggleNotifyEmail = e; throw e }
      finally { loading.toggleNotifyEmail = false }
    }

    async function sendEmailBindingCode(email: string) {
      loading.sendEmailBindingCode = true; errors.sendEmailBindingCode = null
      try { return await profileRepo.sendEmailBindingCode(email) }
      catch (e) { errors.sendEmailBindingCode = e; throw e }
      finally { loading.sendEmailBindingCode = false }
    }

    async function bindEmailIdentity(req: BindEmailRequest) {
      loading.bindEmailIdentity = true; errors.bindEmailIdentity = null
      try { return await profileRepo.bindEmailIdentity(req) }
      catch (e) { errors.bindEmailIdentity = e; throw e }
      finally { loading.bindEmailIdentity = false }
    }

    async function unbindAuthIdentity(provider: BindableOAuthProvider) {
      loading.unbindAuthIdentity = true; errors.unbindAuthIdentity = null
      try { return await profileRepo.unbindAuthIdentity(provider) }
      catch (e) { errors.unbindAuthIdentity = e; throw e }
      finally { loading.unbindAuthIdentity = false }
    }

    async function startOAuthBinding(provider: BindableOAuthProvider, options?: { redirectTo?: string; wechatOAuthSettings?: unknown }) {
      loading.startOAuthBinding = true; errors.startOAuthBinding = null
      try { return await profileRepo.startOAuthBinding(provider, options) }
      catch (e) { errors.startOAuthBinding = e; throw e }
      finally { loading.startOAuthBinding = false }
    }

    async function transferAffiliateQuota() {
      loading.transferAffiliateQuota = true; errors.transferAffiliateQuota = null
      try { return await profileRepo.transferAffiliateQuota() }
      catch (e) { errors.transferAffiliateQuota = e; throw e }
      finally { loading.transferAffiliateQuota = false }
    }

    async function sendVerifyCode() {
      loading.sendVerifyCode = true; errors.sendVerifyCode = null
      try { return await totpRepo.sendVerifyCode() }
      catch (e) { errors.sendVerifyCode = e; throw e }
      finally { loading.sendVerifyCode = false }
    }

    async function initiateSetup(req?: TotpSetupRequest) {
      loading.initiateSetup = true; errors.initiateSetup = null
      try { return await totpRepo.initiateSetup(req) }
      catch (e) { errors.initiateSetup = e; throw e }
      finally { loading.initiateSetup = false }
    }

    async function enable(req: TotpEnableRequest) {
      loading.enable = true; errors.enable = null
      try { return await totpRepo.enable(req) }
      catch (e) { errors.enable = e; throw e }
      finally { loading.enable = false }
    }

    async function disable(req: TotpDisableRequest) {
      loading.disable = true; errors.disable = null
      try { return await totpRepo.disable(req) }
      catch (e) { errors.disable = e; throw e }
      finally { loading.disable = false }
    }

    async function stepUp(code: string) {
      loading.stepUp = true; errors.stepUp = null
      try { return await totpRepo.stepUp(code) }
      catch (e) { errors.stepUp = e; throw e }
      finally { loading.stepUp = false }
    }

    return {
      loading, errors,
      updateProfile, changePassword, sendNotifyEmailCode, verifyNotifyEmail,
      removeNotifyEmail, toggleNotifyEmail, sendEmailBindingCode, bindEmailIdentity,
      unbindAuthIdentity, startOAuthBinding, transferAffiliateQuota,
      sendVerifyCode, initiateSetup, enable, disable, stepUp,
    }
  })
}

export const useProfileActionStore = createProfileActionStore()
