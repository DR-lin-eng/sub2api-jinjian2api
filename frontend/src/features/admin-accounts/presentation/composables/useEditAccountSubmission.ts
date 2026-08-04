import type { Ref } from 'vue'
import type { Account } from '@/types'
import type { CheckMixedChannelResponse } from '../../data/dtos/adminAccountDtos'
import {
  checkMixedChannelRisk,
  updateAccount
} from '../../data/datasources/adminAccountActions'
import type {
  EditAccountUpdatePayloadContext,
} from '../accountEditUpdatePayload'
import { buildEditAccountUpdatePayload } from '../accountEditUpdatePayload'

export interface EditAccountSubmissionContext
  extends EditAccountUpdatePayloadContext {
  account: () => Account | null
  antigravityMixedChannelConfirmed: Ref<boolean>
  mixedChannelWarningAction: Ref<(() => Promise<void>) | null>
  mixedChannelWarningDetails: Ref<{
    groupName: string
    currentPlatform: string
    otherPlatform: string
  } | null>
  mixedChannelWarningRawMessage: Ref<string>
  notifications: EditAccountUpdatePayloadContext['notifications'] & {
    showSuccess: (message: string) => void
  }
  onClose: () => void
  onUpdated: (account: Account) => void
  showMixedChannelWarning: Ref<boolean>
  submitting: Ref<boolean>
}

export function useEditAccountSubmission(context: EditAccountSubmissionContext) {
  const {
    account,
    antigravityMixedChannelConfirmed,
    form,
    mixedChannelWarningAction,
    mixedChannelWarningDetails,
    mixedChannelWarningRawMessage,
    notifications,
    onClose,
    onUpdated,
    showMixedChannelWarning,
    submitting,
    t,
  } = context

  const needsMixedChannelCheck = () =>
    account()?.platform === 'antigravity' || account()?.platform === 'anthropic'

  const buildMixedChannelDetails = (resp?: CheckMixedChannelResponse) => {
    const details = resp?.details
    if (!details) return null
    return {
      groupName: details.group_name || 'Unknown',
      currentPlatform: details.current_platform || 'Unknown',
      otherPlatform: details.other_platform || 'Unknown',
    }
  }

  const clearMixedChannelDialog = () => {
    showMixedChannelWarning.value = false
    mixedChannelWarningDetails.value = null
    mixedChannelWarningRawMessage.value = ''
    mixedChannelWarningAction.value = null
  }

  const openMixedChannelDialog = (options: {
    response?: CheckMixedChannelResponse
    message?: string
    onConfirm: () => Promise<void>
  }) => {
    mixedChannelWarningDetails.value = buildMixedChannelDetails(options.response)
    mixedChannelWarningRawMessage.value =
      options.message ||
      options.response?.message ||
      t('admin.accounts.failedToUpdate')
    mixedChannelWarningAction.value = options.onConfirm
    showMixedChannelWarning.value = true
  }

  const withAntigravityConfirmFlag = (payload: Record<string, unknown>) => {
    if (needsMixedChannelCheck() && antigravityMixedChannelConfirmed.value) {
      return { ...payload, confirm_mixed_channel_risk: true }
    }
    const cloned = { ...payload }
    delete cloned.confirm_mixed_channel_risk
    return cloned
  }

  const ensureAntigravityMixedChannelConfirmed = async (
    onConfirm: () => Promise<void>,
  ): Promise<boolean> => {
    if (!needsMixedChannelCheck()) return true
    if (antigravityMixedChannelConfirmed.value) return true
    const currentAccount = account()
    if (!currentAccount) return false

    try {
      const result = await checkMixedChannelRisk({
        platform: currentAccount.platform,
        group_ids: form.group_ids,
        account_id: currentAccount.id,
      })
      if (!result.has_risk) return true
      openMixedChannelDialog({
        response: result,
        onConfirm: async () => {
          antigravityMixedChannelConfirmed.value = true
          await onConfirm()
        },
      })
      return false
    } catch (error: any) {
      notifications.showError(
        error.message || t('admin.accounts.failedToUpdate'),
      )
      return false
    }
  }

  const handleClose = () => {
    antigravityMixedChannelConfirmed.value = false
    clearMixedChannelDialog()
    onClose()
  }

  const submitUpdateAccount = async (
    accountID: number,
    updatePayload: Record<string, unknown>,
  ) => {
    submitting.value = true
    try {
      const updatedAccount = await updateAccount(
        accountID,
        withAntigravityConfirmFlag(updatePayload),
      )
      notifications.showSuccess(t('admin.accounts.accountUpdated'))
      onUpdated(updatedAccount)
      handleClose()
    } catch (error: any) {
      if (
        error.status === 409 &&
        error.error === 'mixed_channel_warning' &&
        needsMixedChannelCheck()
      ) {
        openMixedChannelDialog({
          message: error.message,
          onConfirm: async () => {
            antigravityMixedChannelConfirmed.value = true
            await submitUpdateAccount(accountID, updatePayload)
          },
        })
        return
      }
      notifications.showError(
        error.message || t('admin.accounts.failedToUpdate'),
      )
    } finally {
      submitting.value = false
    }
  }

  const handleSubmit = async () => {
    const currentAccount = account()
    if (!currentAccount) return

    if (
      form.status !== 'active' &&
      form.status !== 'inactive' &&
      form.status !== 'error'
    ) {
      notifications.showError(t('admin.accounts.pleaseSelectStatus'))
      return
    }

    try {
      const updatePayload = buildEditAccountUpdatePayload(currentAccount, context)
      if (!updatePayload) return

      const canContinue = await ensureAntigravityMixedChannelConfirmed(
        async () => {
          await submitUpdateAccount(currentAccount.id, updatePayload)
        },
      )
      if (!canContinue) return

      await submitUpdateAccount(currentAccount.id, updatePayload)
    } catch (error: any) {
      notifications.showError(
        error.message || t('admin.accounts.failedToUpdate'),
      )
    }
  }

  const handleMixedChannelConfirm = async () => {
    const action = mixedChannelWarningAction.value
    if (!action) {
      clearMixedChannelDialog()
      return
    }
    clearMixedChannelDialog()
    submitting.value = true
    try {
      await action()
    } finally {
      submitting.value = false
    }
  }

  const handleMixedChannelCancel = () => {
    clearMixedChannelDialog()
  }

  return {
    handleClose,
    handleMixedChannelCancel,
    handleMixedChannelConfirm,
    handleSubmit,
  }
}
