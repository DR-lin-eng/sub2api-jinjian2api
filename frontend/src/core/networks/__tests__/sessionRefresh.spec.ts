import axios from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const refreshPayload = {
  access_token: 'access-2',
  refresh_token: 'refresh-2',
  expires_in: 3600,
  token_type: 'Bearer',
}

describe('browser session refresh coordination', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
    localStorage.clear()
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: undefined,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shares one refresh request between concurrent callers in a tab', async () => {
    let resolveRequest!: (value: unknown) => void
    const post = vi.spyOn(axios, 'post').mockReturnValue(new Promise((resolve) => {
      resolveRequest = resolve
    }))
    const { refreshBrowserSession } = await import('@/core/networks/sessionRefresh')

    const first = refreshBrowserSession()
    const second = refreshBrowserSession()
    expect(post).toHaveBeenCalledTimes(1)

    resolveRequest({ data: { code: 0, message: 'success', data: refreshPayload } })
    await expect(Promise.all([first, second])).resolves.toEqual([refreshPayload, refreshPayload])
  })

  it('uses a same-origin Web Lock before rotating the refresh cookie', async () => {
    const request = vi.fn(async (_name, _options, callback: () => Promise<unknown>) => callback())
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: { request },
    })
    vi.spyOn(axios, 'post').mockResolvedValue({
      data: { code: 0, message: 'success', data: refreshPayload },
    })
    const { refreshBrowserSession } = await import('@/core/networks/sessionRefresh')

    await expect(refreshBrowserSession()).resolves.toEqual(refreshPayload)
    expect(request).toHaveBeenCalledWith(
      'sub2api-auth-refresh',
      { mode: 'exclusive' },
      expect.any(Function),
    )
  })

  it('serializes refreshes from separate document modules with the storage lease', async () => {
    vi.useFakeTimers()
    let resolveFirst!: (value: unknown) => void
    const post = vi.spyOn(axios, 'post')
      .mockReturnValueOnce(new Promise((resolve) => {
        resolveFirst = resolve
      }))
      .mockResolvedValueOnce({
        data: { code: 0, message: 'success', data: refreshPayload },
      })

    const firstDocument = await import('@/core/networks/sessionRefresh')
    const first = firstDocument.refreshBrowserSession()
    vi.resetModules()
    const secondDocument = await import('@/core/networks/sessionRefresh')
    const second = secondDocument.refreshBrowserSession()

    expect(post).toHaveBeenCalledTimes(1)
    resolveFirst({ data: { code: 0, message: 'success', data: refreshPayload } })
    await first
    await vi.advanceTimersByTimeAsync(200)
    await expect(second).resolves.toEqual(refreshPayload)
    expect(post).toHaveBeenCalledTimes(2)
    expect(localStorage.getItem('sub2api_auth_refresh_lease')).toBeNull()
  })

  it('releases the storage lease and clears single-flight state after failure', async () => {
    const post = vi.spyOn(axios, 'post')
      .mockRejectedValueOnce(new Error('refresh failed'))
      .mockResolvedValueOnce({
        data: { code: 0, message: 'success', data: refreshPayload },
      })
    const { refreshBrowserSession } = await import('@/core/networks/sessionRefresh')

    await expect(refreshBrowserSession()).rejects.toThrow('refresh failed')
    expect(localStorage.getItem('sub2api_auth_refresh_lease')).toBeNull()
    await expect(refreshBrowserSession()).resolves.toEqual(refreshPayload)
    expect(post).toHaveBeenCalledTimes(2)
  })
})
