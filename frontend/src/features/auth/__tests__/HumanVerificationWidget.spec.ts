import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HumanVerificationWidget from '../presentation/widgets/HumanVerificationWidget.vue'
import type {
  TencentCaptchaConstructor,
  TencentCaptchaProof,
  TencentCaptchaResult
} from '@/core/services/humanVerification'

const loadTencentCaptcha = vi.hoisted(() => vi.fn())

vi.mock('@/core/services/humanVerification', async () => {
  const actual = await vi.importActual<typeof import('@/core/services/humanVerification')>(
    '@/core/services/humanVerification'
  )
  return {
    ...actual,
    loadTencentCaptcha: (...args: unknown[]) => loadTencentCaptcha(...args)
  }
})

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ locale: { value: 'en' } })
}))

type WidgetVM = {
  verifyTencent: () => Promise<TencentCaptchaProof | null>
  reset: () => void
}

describe('HumanVerificationWidget Tencent mode', () => {
  let callback: ((result: TencentCaptchaResult) => void) | undefined
  let show: ReturnType<typeof vi.fn>
  let destroy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    callback = undefined
    show = vi.fn()
    destroy = vi.fn()
    loadTencentCaptcha.mockReset()

    class TencentCaptchaMock {
      constructor(
        _appId: string,
        resultCallback: (result: TencentCaptchaResult) => void
      ) {
        callback = resultCallback
      }

      show = show
      destroy = destroy
    }

    loadTencentCaptcha.mockResolvedValue(
      TencentCaptchaMock as unknown as TencentCaptchaConstructor
    )
  })

  function mountWidget() {
    return mount(HumanVerificationWidget, {
      props: { provider: 'tencent', siteKey: '123456789' },
      global: { stubs: { TurnstileWidget: true } }
    })
  }

  it('returns a valid proof and destroys the SDK instance', async () => {
    const wrapper = mountWidget()
    const pending = (wrapper.vm as unknown as WidgetVM).verifyTencent()
    await flushPromises()

    expect(show).toHaveBeenCalledTimes(1)
    callback?.({ ret: 0, ticket: ' ticket ', randstr: ' rand ' })

    await expect(pending).resolves.toEqual({ ticket: 'ticket', randstr: 'rand' })
    expect(destroy).toHaveBeenCalledTimes(1)
  })

  it('treats user cancellation as a non-error result', async () => {
    const wrapper = mountWidget()
    const pending = (wrapper.vm as unknown as WidgetVM).verifyTencent()
    await flushPromises()

    callback?.({ ret: 2 })

    await expect(pending).resolves.toBeNull()
    expect(destroy).toHaveBeenCalledTimes(1)
  })

  it.each([
    [{ ret: 0, ticket: '', randstr: 'rand' }],
    [{ ret: 0, ticket: 'trerror_1001', randstr: 'rand' }],
    [{ ret: 0, ticket: 'ticket', randstr: 'rand', errorCode: 1001 }]
  ])('rejects malformed or SDK-error results', async result => {
    const wrapper = mountWidget()
    const pending = (wrapper.vm as unknown as WidgetVM).verifyTencent()
    await flushPromises()

    callback?.(result)

    await expect(pending).rejects.toThrow('Tencent Captcha verification failed')
    expect(destroy).toHaveBeenCalledTimes(1)
  })

  it('singleflights concurrent verification and cancels it on reset', async () => {
    const wrapper = mountWidget()
    const vm = wrapper.vm as unknown as WidgetVM
    const first = vm.verifyTencent()
    const second = vm.verifyTencent()
    await flushPromises()

    expect(first).toBe(second)
    expect(show).toHaveBeenCalledTimes(1)

    vm.reset()

    await expect(first).resolves.toBeNull()
    expect(destroy).toHaveBeenCalledTimes(1)
  })

  it('settles a pending SDK load when the provider changes', async () => {
    let resolveSDK: ((constructor: TencentCaptchaConstructor) => void) | undefined
    loadTencentCaptcha.mockImplementation(() => new Promise<TencentCaptchaConstructor>(resolve => {
      resolveSDK = resolve
    }))
    const wrapper = mountWidget()
    const pending = (wrapper.vm as unknown as WidgetVM).verifyTencent()

    await wrapper.setProps({ provider: 'turnstile' })
    await expect(pending).resolves.toBeNull()

    class TencentCaptchaMock {
      show = show
      destroy = destroy
    }
    resolveSDK?.(TencentCaptchaMock as unknown as TencentCaptchaConstructor)
    await flushPromises()
    expect(show).not.toHaveBeenCalled()
  })
})
