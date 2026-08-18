import { apiClient } from './client'
import type { CredentialEnvelope } from '@/types'

const CREDENTIAL_ALGORITHM = 'RSA-OAEP-256+A256GCM' as const
const PUBLIC_KEY_EXPIRY_SKEW_SECONDS = 5

interface CredentialPublicKeyResponse {
  algorithm: typeof CREDENTIAL_ALGORITHM
  key_id: string
  public_key: string
  expires_at: number
  flow_expires_at: number
  server_time: number
}

interface PreparedCredentialKey {
  keyId: string
  publicKeySPKI: Uint8Array
  expiresAt: number
  serverTimeOffset: number
}

interface EncryptedCredential {
  encryptedKey: Uint8Array
  ciphertext: Uint8Array
}

let prefetchedCredentialKey: Promise<PreparedCredentialKey> | null = null
let javascriptFallbackModule: Promise<typeof import('./credentialEncryptionFallback')> | null = null

function requireSecureRandom(): Crypto {
  const cryptoApi = globalThis.crypto
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') {
    throw new Error('Secure credential encryption is not supported by this browser')
  }
  return cryptoApi
}

function randomBytes(cryptoApi: Crypto, length: number): Uint8Array {
  return cryptoApi.getRandomValues(new Uint8Array(length))
}

function optionalSubtleCrypto(cryptoApi: Crypto): SubtleCrypto | undefined {
  try {
    return cryptoApi.subtle
  } catch {
    return undefined
  }
}

function loadJavaScriptFallback(): Promise<typeof import('./credentialEncryptionFallback')> {
  if (!javascriptFallbackModule) {
    const request = import('./credentialEncryptionFallback')
    javascriptFallbackModule = request
    void request.catch(() => {
      if (javascriptFallbackModule === request) {
        javascriptFallbackModule = null
      }
    })
  }
  return javascriptFallbackModule
}

function decodeBase64(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function encodeBase64URL(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function fetchCredentialKey(): Promise<PreparedCredentialKey> {
  const now = Math.floor(Date.now() / 1000)
  const { data } = await apiClient.get<CredentialPublicKeyResponse>('/auth/credential-key')
  if (data.algorithm !== CREDENTIAL_ALGORITHM) {
    throw new Error('Unsupported credential encryption algorithm')
  }
  if (data.expires_at <= data.server_time || data.flow_expires_at <= data.server_time) {
    throw new Error('Credential encryption key is expired')
  }

  return {
    keyId: data.key_id,
    publicKeySPKI: decodeBase64(data.public_key),
    expiresAt: now + Math.max(0, Math.min(data.expires_at, data.flow_expires_at) - data.server_time),
    serverTimeOffset: data.server_time - now
  }
}

async function encryptWithWebCrypto(
  subtle: SubtleCrypto,
  serverKey: PreparedCredentialKey,
  aesKeyBytes: Uint8Array,
  iv: Uint8Array,
  plaintext: Uint8Array,
  additionalData: Uint8Array
): Promise<EncryptedCredential> {
  const [publicKey, aesKey] = await Promise.all([
    subtle.importKey(
      'spki',
      serverKey.publicKeySPKI,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    ),
    subtle.importKey('raw', aesKeyBytes, { name: 'AES-GCM' }, false, ['encrypt'])
  ])
  const [encryptedKey, ciphertext] = await Promise.all([
    subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, aesKeyBytes),
    subtle.encrypt({ name: 'AES-GCM', iv, additionalData }, aesKey, plaintext)
  ])
  return {
    encryptedKey: new Uint8Array(encryptedKey),
    ciphertext: new Uint8Array(ciphertext)
  }
}

async function encryptWithJavaScriptFallback(
  cryptoApi: Crypto,
  serverKey: PreparedCredentialKey,
  aesKey: Uint8Array,
  iv: Uint8Array,
  plaintext: Uint8Array,
  additionalData: Uint8Array
): Promise<EncryptedCredential> {
  const { encryptCredentialWithJavaScript } = await loadJavaScriptFallback()
  return encryptCredentialWithJavaScript({
    publicKeySPKI: serverKey.publicKeySPKI,
    aesKey,
    iv,
    plaintext,
    additionalData,
    oaepSeed: randomBytes(cryptoApi, 32)
  })
}

async function takeCredentialKey(): Promise<PreparedCredentialKey> {
  const prepared = prefetchedCredentialKey
  if (prepared) {
    prefetchedCredentialKey = null
  }

  let key: PreparedCredentialKey
  try {
    key = await (prepared || fetchCredentialKey())
  } catch (error) {
    if (!prepared) {
      throw error
    }
    key = await fetchCredentialKey()
  }

  const now = Math.floor(Date.now() / 1000)
  if (key.expiresAt <= now + PUBLIC_KEY_EXPIRY_SKEW_SECONDS) {
    return fetchCredentialKey()
  }
  return key
}

// Starts a one-shot key request when an auth view opens. The result is consumed
// by the next credential submission and is never persisted across page loads.
export function prefetchCredentialKey(): Promise<void> {
  if (!prefetchedCredentialKey) {
    const request = fetchCredentialKey()
    prefetchedCredentialKey = request
    void request.catch(() => {
      if (prefetchedCredentialKey === request) {
        prefetchedCredentialKey = null
      }
    })
  }

  const cryptoApi = globalThis.crypto
  const fallbackPrefetch = cryptoApi
    && typeof cryptoApi.getRandomValues === 'function'
    && !optionalSubtleCrypto(cryptoApi)
      ? loadJavaScriptFallback().then(() => undefined)
      : Promise.resolve()
  return Promise.allSettled([prefetchedCredentialKey, fallbackPrefetch]).then(() => undefined)
}

export async function createCredentialEnvelope(email: string, password: string): Promise<CredentialEnvelope> {
  const cryptoApi = requireSecureRandom()
  const serverKey = await takeCredentialKey()
  const aesKey = randomBytes(cryptoApi, 32)
  const iv = randomBytes(cryptoApi, 12)
  const encoder = new TextEncoder()
  const plaintext = encoder.encode(JSON.stringify({
    email,
    password,
    issued_at: Math.floor(Date.now() / 1000) + serverKey.serverTimeOffset
  }))
  const additionalData = encoder.encode(serverKey.keyId)

  const subtle = optionalSubtleCrypto(cryptoApi)
  let encrypted: EncryptedCredential
  if (subtle) {
    try {
      encrypted = await encryptWithWebCrypto(
        subtle,
        serverKey,
        aesKey,
        iv,
        plaintext,
        additionalData
      )
    } catch {
      encrypted = await encryptWithJavaScriptFallback(
        cryptoApi,
        serverKey,
        aesKey,
        iv,
        plaintext,
        additionalData
      )
    }
  } else {
    encrypted = await encryptWithJavaScriptFallback(
      cryptoApi,
      serverKey,
      aesKey,
      iv,
      plaintext,
      additionalData
    )
  }

  return {
    algorithm: CREDENTIAL_ALGORITHM,
    key_id: serverKey.keyId,
    encrypted_key: encodeBase64URL(encrypted.encryptedKey),
    iv: encodeBase64URL(iv),
    ciphertext: encodeBase64URL(encrypted.ciphertext)
  }
}

export function clearCredentialKeyPrefetch(): void {
  prefetchedCredentialKey = null
}
