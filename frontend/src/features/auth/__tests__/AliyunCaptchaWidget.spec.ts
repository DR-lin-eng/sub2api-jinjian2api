import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import AliyunCaptchaWidget from '../presentation/widgets/AliyunCaptchaWidget.vue'
import type {
  AliyunCaptchaInitOptions,
  AliyunCaptchaInitializer
} from '@/core/services/humanVerification'

const loadAliyunCaptcha = vi.hoisted(() => vi.fn())

vi.mock('@/core/services/humanVerification', async () => {
  const actual = await vi.importActual<typeof import('@/core/services/humanVerification')>(
    '@/core/services/humanVerification'
  )
  return {
    ...actual,
    loadAliyunCaptcha: (...args: unknown[]) => loadAliyunCaptcha(...args)
  }
})

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: 'en' }
  })
}))

type WidgetVM = {
  reset: () => void
  verifyAliyun: () => Promise<string | null>
}

describe('AliyunCaptchaWidget', () => {
  let options: AliyunCaptchaInitOptions | null

  function mountWidget() {
    return mount(AliyunCaptchaWidget, {
      props: {
        sceneId: 'scene-id',
        prefix: 'prefix-id',
        region: 'sgp'
      },
      global: { stubs: { Icon: true } }
    })
  }

  beforeEach(() => {
    options = null
    loadAliyunCaptcha.mockReset()
    loadAliyunCaptcha.mockResolvedValue(((initOptions: AliyunCaptchaInitOptions) => {
      options = initOptions
      initOptions.getInstance({})
    }) as AliyunCaptchaInitializer)
  })

  afterEach(() => {
    document.getElementById('aliyunCaptcha-mask')?.remove()
    document.getElementById('aliyunCaptcha-window-popup')?.remove()
    vi.restoreAllMocks()
  })

  it('initializes once, clicks once, and returns the normalized token', async () => {
    const wrapper = mountWidget()
    await flushPromises()

    expect(loadAliyunCaptcha).not.toHaveBeenCalled()

    const click = vi.spyOn(HTMLButtonElement.prototype, 'click')
    const pending = (wrapper.vm as unknown as WidgetVM).verifyAliyun()
    await flushPromises()

    expect(loadAliyunCaptcha).toHaveBeenCalledWith('prefix-id', 'sgp')
    expect(options).toMatchObject({
      SceneId: 'scene-id',
      prefix: 'prefix-id',
      mode: 'popup',
      language: 'en'
    })
    expect(click).toHaveBeenCalledTimes(1)
    options?.captchaVerifyCallback('  captcha-token  ')

    await expect(pending).resolves.toBe('captcha-token')
    expect(wrapper.emitted('verify')).toEqual([['captcha-token']])
    expect(loadAliyunCaptcha).toHaveBeenCalledTimes(1)
  })

  it('singleflights concurrent verification and settles it on reset', async () => {
    const wrapper = mountWidget()
    await flushPromises()
    const vm = wrapper.vm as unknown as WidgetVM

    const first = vm.verifyAliyun()
    const second = vm.verifyAliyun()

    expect(first).toBe(second)
    vm.reset()
    await expect(first).resolves.toBeNull()
  })

  it('settles a verification reset while SDK initialization is still pending', async () => {
    let resolveLoader: ((initializer: AliyunCaptchaInitializer) => void) | undefined
    loadAliyunCaptcha.mockReturnValue(new Promise<AliyunCaptchaInitializer>(resolve => {
      resolveLoader = resolve
    }))
    const wrapper = mountWidget()
    const vm = wrapper.vm as unknown as WidgetVM
    const click = vi.spyOn(HTMLButtonElement.prototype, 'click')

    const pending = vm.verifyAliyun()
    vm.reset()
    await expect(pending).resolves.toBeNull()

    resolveLoader?.(((initOptions: AliyunCaptchaInitOptions) => {
      initOptions.getInstance({})
    }) as AliyunCaptchaInitializer)
    await flushPromises()
    expect(click).not.toHaveBeenCalled()
  })

  it('settles pending verification when the component unmounts', async () => {
    const wrapper = mountWidget()
    await flushPromises()

    const pending = (wrapper.vm as unknown as WidgetVM).verifyAliyun()
    await flushPromises()
    wrapper.unmount()

    await expect(pending).resolves.toBeNull()
  })

  it('detects popup closure without starting a polling interval', async () => {
    const wrapper = mountWidget()
    await flushPromises()
    const setInterval = vi.spyOn(window, 'setInterval')

    const pending = (wrapper.vm as unknown as WidgetVM).verifyAliyun()
    await flushPromises()

    const popup = document.createElement('div')
    popup.id = 'aliyunCaptcha-window-popup'
    popup.style.display = 'block'
    document.body.appendChild(popup)
    await new Promise(resolve => window.setTimeout(resolve, 0))
    popup.remove()

    await expect(pending).resolves.toBeNull()
    expect(setInterval).not.toHaveBeenCalled()
  })

  it('does not time out an open popup while the user is verifying', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mountWidget()
      await flushPromises()

      const popup = document.createElement('div')
      popup.id = 'aliyunCaptcha-window-popup'
      popup.style.display = 'block'
      document.body.appendChild(popup)

      const pending = (wrapper.vm as unknown as WidgetVM).verifyAliyun()
      await flushPromises()
      await vi.advanceTimersByTimeAsync(10_001)
      options?.captchaVerifyCallback('captcha-token')

      await expect(pending).resolves.toBe('captcha-token')
      wrapper.unmount()
    } finally {
      vi.useRealTimers()
    }
  })

  it('retries SDK initialization when the user clicks after a load failure', async () => {
    loadAliyunCaptcha.mockRejectedValueOnce(new Error('load failed'))
    const wrapper = mountWidget()
    await flushPromises()
    expect(loadAliyunCaptcha).not.toHaveBeenCalled()

    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(loadAliyunCaptcha).toHaveBeenCalledTimes(1)

    loadAliyunCaptcha.mockResolvedValueOnce(((initOptions: AliyunCaptchaInitOptions) => {
      options = initOptions
      initOptions.getInstance({})
    }) as AliyunCaptchaInitializer)
    await wrapper.get('button').trigger('click')
    await flushPromises()
    options?.captchaVerifyCallback('retry-token')

    expect(loadAliyunCaptcha).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('verify')).toEqual([['retry-token']])
  })
})
