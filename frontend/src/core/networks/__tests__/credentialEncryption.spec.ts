import { webcrypto } from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '../client'
import {
  clearCredentialKeyPrefetch,
  createCredentialEnvelope,
  prefetchCredentialKey
} from '../credentialEncryption'

function encodeBase64(value: ArrayBuffer): string {
  return Buffer.from(value).toString('base64').replace(/=+$/g, '')
}

function decodeBase64URL(value: string): Uint8Array {
  return new Uint8Array(Buffer.from(value, 'base64url'))
}

async function generateServerKey(keyId = 'test-key-id') {
  const serverTime = Math.floor(Date.now() / 1000) + 300
  const keyPair = await webcrypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  )
  const publicKey = await webcrypto.subtle.exportKey('spki', keyPair.publicKey)
  vi.spyOn(apiClient, 'get').mockResolvedValue({
    data: {
      algorithm: 'RSA-OAEP-256+A256GCM',
      key_id: keyId,
      public_key: encodeBase64(publicKey),
      expires_at: serverTime + 3600,
      flow_expires_at: serverTime + 900,
      server_time: serverTime
    }
  })
  return { keyPair, serverTime }
}

async function decryptCredentialEnvelope(
  envelope: Awaited<ReturnType<typeof createCredentialEnvelope>>,
  privateKey: CryptoKey
) {
  const aesKeyBytes = await webcrypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    decodeBase64URL(envelope.encrypted_key)
  )
  const aesKey = await webcrypto.subtle.importKey(
    'raw',
    aesKeyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )
  const plaintext = await webcrypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: decodeBase64URL(envelope.iv),
      additionalData: new TextEncoder().encode(envelope.key_id)
    },
    aesKey,
    decodeBase64URL(envelope.ciphertext)
  )
  return JSON.parse(new TextDecoder().decode(plaintext)) as {
    email: string
    password: string
    issued_at: number
  }
}

describe('credential encryption', () => {
  beforeEach(() => {
    clearCredentialKeyPrefetch()
    vi.restoreAllMocks()
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: webcrypto
    })
  })

  it('creates a server-decryptable RSA-OAEP and AES-GCM envelope', async () => {
    const { keyPair, serverTime } = await generateServerKey()

    const envelope = await createCredentialEnvelope('user@example.com', 'secret-123')
    const credentials = await decryptCredentialEnvelope(envelope, keyPair.privateKey)

    expect(envelope.algorithm).toBe('RSA-OAEP-256+A256GCM')
    expect(credentials.email).toBe('user@example.com')
    expect(credentials.password).toBe('secret-123')
    expect(credentials.issued_at).toBeTypeOf('number')
    expect(Math.abs(credentials.issued_at - serverTime)).toBeLessThanOrEqual(1)
  })

  it('uses an interoperable JavaScript fallback without crypto.subtle', async () => {
    const { keyPair, serverTime } = await generateServerKey('http-ip-key')
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {
        getRandomValues: webcrypto.getRandomValues.bind(webcrypto)
      }
    })

    const envelope = await createCredentialEnvelope('admin@example.com', 'ip-port-secret')
    const credentials = await decryptCredentialEnvelope(envelope, keyPair.privateKey)

    expect(envelope.algorithm).toBe('RSA-OAEP-256+A256GCM')
    expect(envelope.key_id).toBe('http-ip-key')
    expect(credentials).toMatchObject({
      email: 'admin@example.com',
      password: 'ip-port-secret'
    })
    expect(Math.abs(credentials.issued_at - serverTime)).toBeLessThanOrEqual(1)
  })

  it('falls back when the browser exposes subtle but lacks the required algorithms', async () => {
    const { keyPair } = await generateServerKey('partial-webcrypto-key')
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {
        getRandomValues: webcrypto.getRandomValues.bind(webcrypto),
        subtle: {
          importKey: vi.fn().mockRejectedValue(new DOMException('Not supported', 'NotSupportedError'))
        }
      }
    })

    const envelope = await createCredentialEnvelope('admin@example.com', 'fallback-secret')
    const credentials = await decryptCredentialEnvelope(envelope, keyPair.privateKey)

    expect(credentials.password).toBe('fallback-secret')
  })

  it('falls back when reading crypto.subtle throws in an insecure context', async () => {
    const { keyPair } = await generateServerKey('throwing-subtle-key')
    const cryptoApi = {
      getRandomValues: webcrypto.getRandomValues.bind(webcrypto)
    }
    Object.defineProperty(cryptoApi, 'subtle', {
      get: () => {
        throw new DOMException('Secure context required', 'SecurityError')
      }
    })
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: cryptoApi
    })

    const envelope = await createCredentialEnvelope('admin@example.com', 'insecure-context-secret')
    const credentials = await decryptCredentialEnvelope(envelope, keyPair.privateKey)

    expect(credentials.password).toBe('insecure-context-secret')
  })

  it('fails before fetching a key when secure random generation is unavailable', async () => {
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: undefined
    })
    const get = vi.spyOn(apiClient, 'get')

    await expect(createCredentialEnvelope('admin@example.com', 'secret-123'))
      .rejects.toThrow('Secure credential encryption is not supported by this browser')
    expect(get).not.toHaveBeenCalled()
  })

  it('keeps login-page prefetch best-effort when secure random is unavailable', async () => {
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: undefined
    })
    vi.spyOn(apiClient, 'get').mockRejectedValue(new Error('offline'))

    await expect(prefetchCredentialKey()).resolves.toBeUndefined()
  })

  it('consumes a prefetched key once and fetches again for the next submission', async () => {
    const serverTime = Math.floor(Date.now() / 1000)
    const keyPair = await webcrypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    )
    const publicKey = await webcrypto.subtle.exportKey('spki', keyPair.publicKey)
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: {
        algorithm: 'RSA-OAEP-256+A256GCM',
        key_id: 'prefetched-key',
        public_key: encodeBase64(publicKey),
        expires_at: serverTime + 3600,
        flow_expires_at: serverTime + 900,
        server_time: serverTime
      }
    })

    await prefetchCredentialKey()
    await createCredentialEnvelope('first@example.com', 'secret-123')
    await createCredentialEnvelope('second@example.com', 'secret-456')

    expect(get).toHaveBeenCalledTimes(2)
  })

  it('prefetches the key in an insecure IP-style browser context', async () => {
    const { keyPair } = await generateServerKey('prefetched-http-key')
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {
        getRandomValues: webcrypto.getRandomValues.bind(webcrypto)
      }
    })

    await prefetchCredentialKey()
    const envelope = await createCredentialEnvelope('admin@example.com', 'prefetched-secret')
    const credentials = await decryptCredentialEnvelope(envelope, keyPair.privateKey)

    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(credentials.password).toBe('prefetched-secret')
  })

  it('refreshes a prefetched key that is too close to expiration', async () => {
    const serverTime = Math.floor(Date.now() / 1000)
    const keyPair = await webcrypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    )
    const publicKey = await webcrypto.subtle.exportKey('spki', keyPair.publicKey)
    const get = vi.spyOn(apiClient, 'get')
      .mockResolvedValueOnce({
        data: {
          algorithm: 'RSA-OAEP-256+A256GCM',
          key_id: 'nearly-expired-key',
          public_key: encodeBase64(publicKey),
          expires_at: serverTime + 3,
          flow_expires_at: serverTime + 3,
          server_time: serverTime
        }
      })
      .mockResolvedValueOnce({
        data: {
          algorithm: 'RSA-OAEP-256+A256GCM',
          key_id: 'fresh-key',
          public_key: encodeBase64(publicKey),
          expires_at: serverTime + 3600,
          flow_expires_at: serverTime + 900,
          server_time: serverTime
        }
      })

    await prefetchCredentialKey()
    const envelope = await createCredentialEnvelope('user@example.com', 'secret-123')

    expect(get).toHaveBeenCalledTimes(2)
    expect(envelope.key_id).toBe('fresh-key')
  })
})
