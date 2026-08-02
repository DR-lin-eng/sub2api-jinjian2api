import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { get, post, patch, remove, credentialGet, credentialCreate } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  remove: vi.fn(),
  credentialGet: vi.fn(),
  credentialCreate: vi.fn(),
}))

vi.mock('@/core/networks/client', () => ({
  apiClient: {
    get,
    post,
    patch,
    delete: remove,
  },
}))

import { passkeysActionDatasource } from '@/features/passkeys/data/datasources/passkeysActionDatasource'
import { passkeysQueryDatasource } from '@/features/passkeys/data/datasources/passkeysQueryDatasource'
import { authActionDatasource } from '@/features/auth/data/datasources/authActionDatasource'

class FakePublicKeyCredential {
  id = 'credential-id'
  rawId = Uint8Array.from([1, 2, 3]).buffer
  type = 'public-key'
  authenticatorAttachment = 'platform'
  response: Record<string, unknown> = {
    authenticatorData: Uint8Array.from([4, 5]).buffer,
    clientDataJSON: Uint8Array.from([6, 7]).buffer,
    signature: Uint8Array.from([8, 9]).buffer,
    userHandle: Uint8Array.from([10, 11]).buffer,
  }

  getClientExtensionResults(): AuthenticationExtensionsClientOutputs {
    return {}
  }
}

class FakeRegistrationCredential extends FakePublicKeyCredential {
  constructor() {
    super()
    this.response = {
      attestationObject: Uint8Array.from([12, 13]).buffer,
      clientDataJSON: Uint8Array.from([6, 7]).buffer,
      getTransports: () => ['internal'],
    }
  }
}

describe('passkey datasources', () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
    patch.mockReset()
    remove.mockReset()
    credentialGet.mockReset()
    credentialCreate.mockReset()

    vi.stubGlobal('PublicKeyCredential', FakePublicKeyCredential)
    Object.defineProperty(window, 'PublicKeyCredential', {
      configurable: true,
      value: FakePublicKeyCredential,
    })
    Object.defineProperty(navigator, 'credentials', {
      configurable: true,
      value: { get: credentialGet, create: credentialCreate },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('query datasource reports browser support and maps credential summaries', async () => {
    get.mockResolvedValue({
      data: [
        {
          id: 7,
          name: 'Laptop',
          created_at: '2026-07-28T00:00:00Z',
          last_used_at: '2026-07-29T00:00:00Z',
          backup: true,
        },
      ],
    })

    const items = await passkeysQueryDatasource.list()

    expect(passkeysQueryDatasource.isSupported()).toBe(true)
    expect(get).toHaveBeenCalledWith('/user/passkeys')
    expect(items[0].toEntity()).toMatchObject({
      id: 7,
      name: 'Laptop',
      createdAt: '2026-07-28T00:00:00Z',
      lastUsedAt: '2026-07-29T00:00:00Z',
      backup: true,
    })
  })

  it('converts assertion options and response bytes to WebAuthn JSON', async () => {
    post
      .mockResolvedValueOnce({
        data: {
          session_token: 'one-time-session',
          options: {
            publicKey: {
              challenge: 'AQID',
              rpId: 'sub2api.example.com',
              userVerification: 'required',
            },
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          access_token: 'access',
          token_type: 'Bearer',
          user: { id: 1 },
        },
      })
    credentialGet.mockResolvedValue(new FakePublicKeyCredential())

    await authActionDatasource.loginWithPasskey()

    const request = credentialGet.mock.calls[0][0] as CredentialRequestOptions
    expect(Array.from(new Uint8Array(request.publicKey!.challenge))).toEqual([1, 2, 3])
    expect(request.publicKey!.userVerification).toBe('required')

    expect(post).toHaveBeenNthCalledWith(2, '/auth/passkey/login/finish', {
      session_token: 'one-time-session',
      credential: {
        id: 'credential-id',
        rawId: 'AQID',
        type: 'public-key',
        authenticatorAttachment: 'platform',
        clientExtensionResults: {},
        response: {
          authenticatorData: 'BAU',
          clientDataJSON: 'Bgc',
          signature: 'CAk',
          userHandle: 'Cgs',
        },
      },
    })
  })

  it('sends the account password when beginning registration', async () => {
    post
      .mockResolvedValueOnce({
        data: {
          session_token: 'register-session',
          options: {
            publicKey: {
              challenge: 'AQID',
              user: { id: 'BAU', name: 'user@example.com', displayName: 'user' },
            },
          },
        },
      })
      .mockResolvedValueOnce({
        data: { id: 3, name: 'Laptop', created_at: '2026-07-28T00:00:00Z', backup: false },
      })
    credentialCreate.mockResolvedValue(new FakeRegistrationCredential())

    await passkeysActionDatasource.register({ name: 'Laptop', password: 'hunter2' })

    expect(post).toHaveBeenNthCalledWith(1, '/user/passkeys/register/begin', {
      password: 'hunter2',
    })
    expect(post).toHaveBeenNthCalledWith(2, '/user/passkeys/register/finish', {
      session_token: 'register-session',
      name: 'Laptop',
      credential: expect.objectContaining({
        response: {
          attestationObject: 'DA0',
          clientDataJSON: 'Bgc',
          transports: ['internal'],
        },
      }),
    })
  })

  it('sends the account password when revoking a credential', async () => {
    remove.mockResolvedValue({ data: null })

    await passkeysActionDatasource.remove(12, { password: 'hunter2' })

    expect(remove).toHaveBeenCalledWith('/user/passkeys/12', {
      data: { password: 'hunter2' },
    })
  })
})
