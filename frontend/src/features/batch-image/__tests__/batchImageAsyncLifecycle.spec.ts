import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createBatchImageGenerationScope,
  createBatchImageLatestSingleFlight,
  replaceBatchImageObjectURL,
  revokeBatchImageObjectURLs,
  type BatchImageGenerationSnapshot,
} from '@/features/batch-image/presentation/composables/batchImageAsyncLifecycle'
import { createBatchImagePreviewCache } from '@/features/batch-image/presentation/preview/batchImagePreviewCache'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete (window as Window & { createImageBitmap?: typeof window.createImageBitmap }).createImageBitmap
})

describe('batch image async lifecycle', () => {
  it('serializes refreshes and rejects a stale detail response after selection changes', async () => {
    type RefreshRequest = {
      id: 'A' | 'B'
      snapshot: BatchImageGenerationSnapshot
    }

    const responses = {
      A: deferred<string>(),
      B: deferred<string>(),
    }
    const scope = createBatchImageGenerationScope()
    const commits: string[] = []
    const busyStates: boolean[] = []
    let currentOwner = 'A'
    let activeRequests = 0
    let maxActiveRequests = 0

    const run = vi.fn(async (request: RefreshRequest) => {
      activeRequests += 1
      maxActiveRequests = Math.max(maxActiveRequests, activeRequests)
      try {
        const value = await responses[request.id].promise
        if (scope.isCurrent(request.snapshot, currentOwner)) {
          commits.push(value)
        }
      } finally {
        activeRequests -= 1
      }
    })
    const refreshes = createBatchImageLatestSingleFlight<RefreshRequest>({
      key: request => `${request.snapshot.generation}:${request.id}`,
      isCurrent: request => scope.isCurrent(request.snapshot, currentOwner),
      run,
      onBusyChange: busy => busyStates.push(busy),
    })

    const requestA = {
      id: 'A' as const,
      snapshot: scope.capture(currentOwner),
    }
    const promiseA = refreshes.request(requestA)
    expect(run).toHaveBeenCalledTimes(1)

    currentOwner = 'B'
    scope.invalidate()
    refreshes.clearPending()
    const requestB = {
      id: 'B' as const,
      snapshot: scope.capture(currentOwner),
    }
    const promiseB = refreshes.request(requestB)

    expect(promiseB).toBe(promiseA)
    expect(run).toHaveBeenCalledTimes(1)
    responses.A.resolve('stale A')
    await vi.waitFor(() => expect(run).toHaveBeenCalledTimes(2))
    expect(maxActiveRequests).toBe(1)

    responses.B.resolve('current B')
    await Promise.all([promiseA, promiseB])
    expect(commits).toEqual(['current B'])
    expect(busyStates).toEqual([true, false])
  })

  it('coalesces repeated polling triggers for the active detail', async () => {
    const response = deferred<void>()
    const scope = createBatchImageGenerationScope()
    const snapshot = scope.capture('batch-1')
    const run = vi.fn(async () => response.promise)
    const refreshes = createBatchImageLatestSingleFlight({
      key: () => `${snapshot.generation}:batch-1`,
      isCurrent: () => scope.isCurrent(snapshot, 'batch-1'),
      run,
    })

    const first = refreshes.request(snapshot)
    const second = refreshes.request(snapshot)
    expect(second).toBe(first)
    expect(run).toHaveBeenCalledTimes(1)

    response.resolve()
    await first
    expect(refreshes.isRunning()).toBe(false)
  })

  it('revokes stale and replaced object URLs across close and dispose', () => {
    const scope = createBatchImageGenerationScope()
    const urls: Record<string, string> = {}
    const revokeObjectURL = vi.fn()
    const createObjectURL = vi
      .fn<(blob: Blob) => string>()
      .mockReturnValueOnce('blob:current')
      .mockImplementationOnce(() => {
        scope.invalidate()
        return 'blob:closed-during-create'
      })
      .mockReturnValueOnce('blob:replacement')
      .mockReturnValueOnce('blob:disposed')
    const urlAPI = { createObjectURL, revokeObjectURL }

    const initial = scope.capture('batch-1')
    expect(replaceBatchImageObjectURL(
      urls,
      'preview',
      new Blob(['initial']),
      () => scope.isCurrent(initial, 'batch-1'),
      urlAPI,
    )).toBe(true)

    const closing = scope.capture('batch-1')
    expect(replaceBatchImageObjectURL(
      urls,
      'preview',
      new Blob(['closed']),
      () => scope.isCurrent(closing, 'batch-1'),
      urlAPI,
    )).toBe(false)
    expect(urls.preview).toBe('blob:current')

    const replacement = scope.capture('batch-1')
    expect(replaceBatchImageObjectURL(
      urls,
      'preview',
      new Blob(['replacement']),
      () => scope.isCurrent(replacement, 'batch-1'),
      urlAPI,
    )).toBe(true)

    const disposing = scope.capture('batch-1')
    scope.dispose()
    expect(replaceBatchImageObjectURL(
      urls,
      'late-preview',
      new Blob(['disposed']),
      () => scope.isCurrent(disposing, 'batch-1'),
      urlAPI,
    )).toBe(false)

    revokeBatchImageObjectURLs(urls, urlAPI)
    expect(urls).toEqual({})
    expect(revokeObjectURL.mock.calls.map(([url]) => url)).toEqual([
      'blob:closed-during-create',
      'blob:current',
      'blob:disposed',
      'blob:replacement',
    ])
  })
})

describe('batch image thumbnail cleanup', () => {
  it('closes ImageBitmap when canvas processing fails', async () => {
    const close = vi.fn()
    Object.defineProperty(window, 'createImageBitmap', {
      configurable: true,
      value: vi.fn().mockResolvedValue({ width: 12, height: 8, close }),
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    const cache = createBatchImagePreviewCache()
    await expect(cache.createThumbnail(new Blob(['bitmap']))).rejects.toThrow('canvas unavailable')
    expect(close).toHaveBeenCalledOnce()
  })

  it('revokes the fallback image URL when canvas processing fails', async () => {
    class FakeImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      naturalWidth = 12
      naturalHeight = 8
      width = 12
      height = 8

      set src(_value: string) {
        queueMicrotask(() => this.onload?.())
      }
    }

    const createObjectURLDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
    const revokeObjectURLDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')
    const createObjectURL = vi.fn().mockReturnValue('blob:fallback')
    const revokeObjectURL = vi.fn()
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL })
    try {
      vi.stubGlobal('Image', FakeImage)
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

      const cache = createBatchImagePreviewCache()
      await expect(cache.createThumbnail(new Blob(['fallback']))).rejects.toThrow('canvas unavailable')
      expect(createObjectURL).toHaveBeenCalledOnce()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:fallback')
    } finally {
      if (createObjectURLDescriptor) {
        Object.defineProperty(URL, 'createObjectURL', createObjectURLDescriptor)
      } else {
        delete (URL as typeof URL & { createObjectURL?: typeof URL.createObjectURL }).createObjectURL
      }
      if (revokeObjectURLDescriptor) {
        Object.defineProperty(URL, 'revokeObjectURL', revokeObjectURLDescriptor)
      } else {
        delete (URL as typeof URL & { revokeObjectURL?: typeof URL.revokeObjectURL }).revokeObjectURL
      }
    }
  })
})
