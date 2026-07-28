import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { batchImagePreviewCacheKey } from '@/features/batch-image/presentation/preview/batchImagePreviewCache'
import { useBatchImagePromptPopover } from '@/features/batch-image/presentation/composables/useBatchImagePromptPopover'
import { createBatchImageMessages } from '@/features/batch-image/presentation/resolvers/batchImageMessages'

const currentDir = dirname(fileURLToPath(import.meta.url))
const readFeatureSource = (relativePath: string) =>
  readFileSync(resolve(currentDir, relativePath), 'utf8')

const pageSource = readFeatureSource('../presentation/pages/BatchImageGuidePage.vue')
const workspaceSource = readFeatureSource('../presentation/widgets/BatchImageGuideWorkspace.vue')
const controllerSource = readFeatureSource('../presentation/composables/useBatchImageGuideController.ts')
const previewCacheSource = readFeatureSource('../presentation/preview/batchImagePreviewCache.ts')

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('batch image modularization', () => {
  it('keeps the workspace static and all requests in the controller owner', () => {
    expect(pageSource).toContain(
      "import BatchImageGuideWorkspace from '@/features/batch-image/presentation/widgets/BatchImageGuideWorkspace.vue'"
    )
    expect(pageSource).toContain('useBatchImageGuideController()')
    expect(workspaceSource).not.toContain('listBatchImageJobs')
    expect(workspaceSource).not.toContain('getBatchImageJob')
    expect(controllerSource).toContain('listBatchImageJobs(key.key, options)')
    expect(controllerSource).toContain('getBatchImageJob(key.key, selectedBatchId.value)')
    expect(`${pageSource}\n${workspaceSource}\n${controllerSource}`).not.toContain('import(')
  })

  it('preserves polling, cache cleanup, and object URL cleanup contracts', () => {
    expect(controllerSource).toContain('}, 8000)')
    expect(controllerSource).toContain('}, 60 * 60 * 1000)')
    expect(controllerSource).toContain('URL.revokeObjectURL(url)')
    expect(previewCacheSource).toContain("const PREVIEW_CACHE_DB_NAME = 'sub2api-batch-image-preview-cache'")
    expect(previewCacheSource).toContain('const PREVIEW_CACHE_MAX_ENTRIES = 120')
    expect(previewCacheSource).toContain('const PREVIEW_CACHE_MAX_BYTES = 48 * 1024 * 1024')
    expect(batchImagePreviewCacheKey('batch/id', 'custom id', 2)).toBe(
      'batch%2Fid:custom%20id:2'
    )
  })

  it('keeps prompt preview open and close delays unchanged', async () => {
    vi.useFakeTimers()
    const copy = vi.fn()
    const target = document.createElement('button')
    document.body.appendChild(target)
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      x: 20,
      y: 20,
      top: 20,
      right: 220,
      bottom: 60,
      left: 20,
      width: 200,
      height: 40,
      toJSON: () => ({}),
    })
    const popover = useBatchImagePromptPopover({ copy })

    popover.schedulePromptPopoverOpen(
      { currentTarget: target } as unknown as PointerEvent,
      'preview prompt'
    )
    await vi.advanceTimersByTimeAsync(519)
    expect(popover.promptPopover.visible).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(popover.promptPopover.visible).toBe(true)

    popover.copyPromptPopover()
    expect(copy).toHaveBeenCalledWith('preview prompt')
    popover.schedulePromptPopoverClose()
    await vi.advanceTimersByTimeAsync(179)
    expect(popover.promptPopover.visible).toBe(true)
    await vi.advanceTimersByTimeAsync(1)
    expect(popover.promptPopover.visible).toBe(false)
  })

  it('keeps localized admin error references and permission errors stable', () => {
    const messages = createBatchImageMessages({
      text: key => key,
      interpolate: (key, params) => `${key}:${String(Object.values(params)[0])}`,
      locale: () => 'zh-CN',
    })

    expect(messages.batchImageErrorMessage(
      { code: 'API_KEY_REQUIRED' },
      'fallback'
    )).toBe('batchImage.messages.authRequired')
    expect(messages.batchImageErrorMessage(
      { code: 'BATCH_IMAGE_NO_ACCOUNT_AVAILABLE', requestId: 'request-1' },
      'fallback'
    )).toBe(
      'batchImage.messages.noCompatibleAccount （batchImage.messages.errorCodeRef:BATCH_IMAGE_NO_ACCOUNT_AVAILABLE，batchImage.messages.requestIdRef:request-1） batchImage.messages.adminReference'
    )
  })
})
